'use client';

import { HTMLAttributes } from 'react';
import { OrderWithStock } from '../portfolio/types/portfolio';
import { DeleteModal } from './delete-modal';
import { UpdateOrderModal } from './update-order-modal';

interface Props extends HTMLAttributes<HTMLDivElement> {
  order: OrderWithStock;
}

export const OrderActions = ({ order }: Props) => {
  return (
    <div className="f-center gap-2">
      <UpdateOrderModal order={order} />
      <DeleteModal order={order} />
    </div>
  );
};
