import { z } from 'zod';

const OrderSchema = z.object({
  id: z.string(),
  stockId: z.string(),
  date: z.string().refine(
    (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const minDate = new Date('1970-01-01T00:00:00Z');
      return !Number.isNaN(date.getTime()) && date <= now && date >= minDate;
    },
    {
      message: 'Date must be between 1.1.1970 and now',
    },
  ),
  type: z.string(),
  price: z.coerce.number().positive().optional(),
  quantity: z.coerce.number().positive().default(1),
});

export const OrderSchemaWithoutId = OrderSchema.omit({ id: true });

export const AddOrdersSchema = z.object({
  portfolioId: z.string(),
  orders: z.array(OrderSchemaWithoutId),
});

export const UpdateOrderSchema = OrderSchema.omit({
  stockId: true,
  type: true,
});

export const RemovePositionSchema = z.object({
  portfolioId: z.string(),
  stockId: z.string(),
});

export const DeleteOrderSchema = z.object({
  orderId: z.string(),
});

export type OrderProps = z.infer<typeof OrderSchema>;
export type OrderPropsWithoutId = z.infer<typeof OrderSchemaWithoutId>;
export type AddOrdersProps = z.infer<typeof AddOrdersSchema>;
export type UpdateOrderProps = z.infer<typeof UpdateOrderSchema>;
export type RemovePositionProps = z.infer<typeof RemovePositionSchema>;
export type DeleteOrderProps = z.infer<typeof DeleteOrderSchema>;
