import { z } from 'zod'

export const OrderSchema = z.object({
  stockId: z.string(),
  date: z.string().date(),
  type: z.enum(['BUY', 'SELL']),
  price: z.number().positive(),
  quantity: z.number().positive().default(1),
})

const TitleSchema = z
  .string()
  .min(1, 'Title must be at least 1 character long.')
  .max(25, 'Title must be less than 25 characters long.')

export const CreatePortfolioSchema = z.object({
  title: TitleSchema,
  isPublic: z.boolean().default(false),
  orders: z.array(OrderSchema).optional(),
})

export const UpdatePortfolioSchema = z.object({
  portfolioId: z.string(),
  title: TitleSchema.optional(),
  isPublic: z.boolean().optional(),
  color: z.string().optional(),
})

export const DeletePortfolioSchema = z.object({
  portfolioId: z.string(),
})

export const AddOrdersSchema = z.object({
  portfolioId: z.string(),
  orders: z.array(OrderSchema),
})

export const EditOrderSchema = z.object({
  portfolioId: z.string(),
  order: OrderSchema.omit({ stockId: true }),
})

export const DeleteOrderSchema = z.object({
  orderId: z.string(),
})

export const PortfolioHistorySchema = z.object({
  portfolioId: z.string(),
  options: z
    .object({
      excludeQuantity: z.boolean().default(false),
    })
    .optional(),
})

export type OrderProps = z.infer<typeof OrderSchema>
export type CreatePortfolioProps = z.infer<typeof CreatePortfolioSchema>
export type UpdatePortfolioProps = z.infer<typeof UpdatePortfolioSchema>
export type DeletePortfolioProps = z.infer<typeof DeletePortfolioSchema>
export type AddOrdersProps = z.infer<typeof AddOrdersSchema>
export type EditOrderProps = z.infer<typeof EditOrderSchema>
export type DeleteOrderProps = z.infer<typeof DeleteOrderSchema>
export type PortfolioHistoryProps = z.infer<typeof PortfolioHistorySchema>
