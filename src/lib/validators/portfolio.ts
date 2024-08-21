import { z } from 'zod'

const OrderSchema = z.object({
  id: z.string(),
  stockId: z.string(),
  date: z.string().refine(
    (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const minDate = new Date('1970-01-01T00:00:00Z')
      return !isNaN(date.getTime()) && date <= now && date >= minDate
    },
    {
      message: 'Date must be between 1.1.1970 and now',
    },
  ),
  type: z.enum(['BUY', 'SELL']),
  price: z.coerce.number().positive().optional(),
  quantity: z.coerce.number().positive().default(1),
})

export const OrderSchemaWithoutId = OrderSchema.omit({ id: true })

const TitleSchema = z
  .string()
  .min(1, 'Title must be at least 1 character long.')
  .max(25, 'Title must be at most 25 characters long.')

export const CreatePortfolioSchema = z.object({
  title: TitleSchema,
  isPublic: z.boolean().default(false),
  orders: z.array(OrderSchemaWithoutId).optional(),
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
  orders: z.array(OrderSchemaWithoutId),
})

export const UpdateOrderSchema = OrderSchema.omit({ stockId: true, type: true })

export const RemovePositionSchema = z.object({
  portfolioId: z.string(),
  stockId: z.string(),
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
export type OrderPropsWithoutId = z.infer<typeof OrderSchemaWithoutId>
export type CreatePortfolioProps = z.infer<typeof CreatePortfolioSchema>
export type UpdatePortfolioProps = z.infer<typeof UpdatePortfolioSchema>
export type DeletePortfolioProps = z.infer<typeof DeletePortfolioSchema>
export type AddOrdersProps = z.infer<typeof AddOrdersSchema>
export type UpdateOrderProps = z.infer<typeof UpdateOrderSchema>
export type RemovePositionProps = z.infer<typeof RemovePositionSchema>
export type DeleteOrderProps = z.infer<typeof DeleteOrderSchema>
export type PortfolioHistoryProps = z.infer<typeof PortfolioHistorySchema>
