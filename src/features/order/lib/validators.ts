import { z } from 'zod';

export const OrderSchema = z.object({
  date: z.preprocess(
    (arg) => {
      if (arg instanceof Date) {
        return arg.toISOString();
      }
      if (typeof arg === 'string') {
        return arg;
      }
    },
    z.string().refine(
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
  ),
  id: z.string(),
  price: z.coerce.number().positive('Price must be higher than 0.').optional(),
  quantity: z.coerce
    .number()
    .positive('Quantity must be higher than 0.')
    .default(1),
  stockId: z.number(),
  type: z.string(),
});

export const OrderSchemaWithoutId = OrderSchema.omit({ id: true });

export const AddOrdersSchema = z.object({
  orders: z.array(OrderSchemaWithoutId),
  portfolioId: z.string(),
});

export const UpdateOrderSchema = OrderSchema.omit({
  stockId: true,
  type: true,
});

export const RemovePositionSchema = z.object({
  portfolioId: z.string(),
  stockId: z.number(),
});

export const DeleteOrderSchema = z.object({
  orderId: z.string(),
});

export type AddOrdersProps = z.infer<typeof AddOrdersSchema>;
export type DeleteOrderProps = z.infer<typeof DeleteOrderSchema>;
export type OrderProps = z.infer<typeof OrderSchema>;
export type OrderPropsWithoutId = z.infer<typeof OrderSchemaWithoutId>;
export type RemovePositionProps = z.infer<typeof RemovePositionSchema>;
export type UpdateOrderProps = z.infer<typeof UpdateOrderSchema>;
