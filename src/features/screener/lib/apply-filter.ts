import { Prisma } from '@prisma/client';

export const applyTextFilter = ({
  value,
  filter,
  filterProp,
}: {
  value: string;
  filter: Prisma.StockWhereInput;
  filterProp: keyof Prisma.StockWhereInput;
}) => {
  if (value && value !== 'Any') {
    (filter[filterProp] as string) = value;
  }
};

export const applyNumericFilter = ({
  values,
  selectionSpan,
  filter,
  filterProp,
}: {
  values: [string, string];
  selectionSpan: string[];
  filter: Prisma.StockWhereInput;
  filterProp: keyof Prisma.StockWhereInput;
}) => {
  if (values || (values[0] === 'Any' && values[1] === 'Any')) {
    const [left, right] = values;
    let valueFilter: Prisma.FloatNullableFilter | undefined;

    const highestStringValue = selectionSpan.at(-1);
    const highestValue = Number.parseFloat(
      highestStringValue?.split('>')[1] ?? '0',
    );

    switch (true) {
      case left === highestStringValue: {
        valueFilter = { lt: highestValue };
        break;
      }
      case right === highestStringValue: {
        valueFilter = { gt: highestValue };
        break;
      }
      case left !== 'Any' && right !== 'Any': {
        valueFilter = {
          lte: Number.parseFloat(left),
          gte: Number.parseFloat(right),
        };
        break;
      }
      case left !== 'Any': {
        valueFilter = { lte: Number(left) };
        break;
      }
      case right !== 'Any': {
        valueFilter = { gte: Number(right) };
        break;
      }
    }

    if (valueFilter) {
      (filter[filterProp] as Prisma.FloatNullableFilter) = valueFilter;
    }
  }
};
