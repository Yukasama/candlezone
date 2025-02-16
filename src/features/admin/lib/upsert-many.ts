import { appConfig } from '@/config/app';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import pLimit from 'p-limit';
import { PrismaValue, StockUpdateData } from '../types/prisma';
import { unwrapPrismaValue } from './unwrap-prisma-value';

const { batchSize, concurrencyLimit } = appConfig.upload;

export const upsertManyStocks = async (
  updates: StockUpdateData[],
  startTime: number,
): Promise<number> => {
  if (updates.length === 0) {
    return 0;
  }

  const limit = pLimit(concurrencyLimit);
  let updatedCount = 0;
  const excludedFields = new Set([
    'createdAt',
    'earnings',
    'financials',
    'orders',
    'recentUsers',
    'stars',
  ]);

  const chunks: StockUpdateData[][] = [];
  for (let i = 0; i < updates.length; i += batchSize) {
    chunks.push(updates.slice(i, i + batchSize));
  }

  const processChunk = async (chunk: StockUpdateData[], index: number) => {
    const columns = Object.keys(chunk[0]).filter(
      (col) => col !== 'id' && !excludedFields.has(col),
    );

    const sqlParams: PrismaValue[] = [];
    const cases: string[] = [];

    for (const col of columns) {
      const whenClauses = chunk
        .map((row) => {
          const rawValue = row[col as keyof typeof row];
          const value = unwrapPrismaValue(rawValue);
          sqlParams.push(row.id, value);
          return 'WHEN id = ? THEN ?';
        })
        .join(' ');

      cases.push(`"${col}" = CASE ${whenClauses} ELSE "${col}" END`);
    }

    const whereIds = chunk.map((row) => row.id);
    sqlParams.push(...whereIds);

    const sql = `
    UPDATE "Stock" 
    SET ${cases.join(', ')},
        "updatedAt" = datetime('now')
    WHERE id IN (${whereIds.map(() => '?').join(', ')});
  `;

    await db.$executeRawUnsafe(sql, ...sqlParams);

    const progress = (
      (((index + 1) * batchSize) / updates.length) *
      100
    ).toFixed(1);
    logger.info(
      'uploadStocks (updates_running): progress=%s, time=%ss',
      `${String(Math.min(Number(progress), 100))}%`,
      ((Date.now() - startTime) / 1000).toFixed(1),
    );

    return chunk.length;
  };

  const results = await Promise.all(
    chunks.map((chunk, index) => limit(() => processChunk(chunk, index))),
  );

  updatedCount = results.reduce((sum, count) => sum + count, 0);
  return updatedCount;
};
