import type { Prisma } from '@prisma/client';

export type PrismaValue = boolean | Date | null | number | string;

export type StockUpdateData = Omit<Prisma.StockUncheckedUpdateInput, 'id'> & {
  id: number;
};
