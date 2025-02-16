import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { PrismaValue, StockUpdateData } from '../types/prisma';
import { unwrapPrismaValue } from './unwrap-prisma-value';

export const upsertManyStocks = async (
  updates: StockUpdateData[],
  startTime: number,
  chunkSize = 150,
): Promise<number> => {
  if (updates.length === 0) {
    return 0;
  }

  let updatedCount = 0;
  const excludedFields = new Set([
    'createdAt',
    'earnings',
    'financials',
    'orders',
    'recentUsers',
    'stars',
    'updatedAt',
  ]);

  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
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
      SET ${cases.join(', ')}
      WHERE id IN (${whereIds.map(() => '?').join(', ')});
    `;

    await db.$executeRawUnsafe(sql, ...sqlParams);
    logger.info(
      'uploadStocks (updates_running): progress=%s, time=%ss',
      `${(((i + chunkSize) / updates.length) * 100).toFixed(1)}%`,
      ((Date.now() - startTime) / 1000).toFixed(1),
    );
    updatedCount += chunk.length;
  }

  return updatedCount;
};
