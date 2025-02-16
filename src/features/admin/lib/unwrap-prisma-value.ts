import { PrismaValue } from '../types/prisma';

// eslint-disable-next-line sonarjs/function-return-type
export const unwrapPrismaValue = (value: unknown): PrismaValue => {
  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      return value.toString();
    }
    return value;
  }

  if (value && typeof value === 'object') {
    if ('set' in value) {
      // eslint-disable-next-line unicorn/no-null
      return unwrapPrismaValue((value as { set: unknown }).set) ?? null;
    }
    if (value instanceof Date) {
      return value;
    }
  }
  return value as PrismaValue;
};
