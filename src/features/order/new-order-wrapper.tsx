import type { Stock } from '@prisma/client';
import { getFullPortfoliosByUser } from '../portfolio/lib/queries';
import { NewOrderModal } from './new-order-modal';

interface Props {
  stock: Pick<Stock, 'companyName' | 'id' | 'image' | 'range' | 'symbol'>;
}

export const NewOrderWrapper = async ({ stock }: Props) => {
  const portfolios = await getFullPortfoliosByUser();

  return <NewOrderModal portfolios={portfolios} stock={stock} />;
};
