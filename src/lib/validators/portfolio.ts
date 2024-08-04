import { z } from 'zod'

export const CreatePortfolioSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must be at least 1 character long.')
    .max(25, 'Title must be less than 25 characters long.'),
  isPublic: z.boolean().default(false).optional(),
  stockIds: z
    .array(z.string())
    .max(20, 'A maximum of 20 symbols can be added at a time.')
    .optional(),
})

export const UpdatePortfolioSchema = z.object({
  portfolioId: z.string(),
  title: z
    .string()
    .min(1, 'Title must be at least 1 character long.')
    .max(20, 'Title must be less than 20 characters long.')
    .optional(),
  isPublic: z.boolean().optional(),
})

const AddPositionSchema = z.object({
  stockId: z.string(),
  quantity: z.number().positive(),
  price: z.number(),
  date: z.string(),
})

export const AddPortfolioPositionSchema = z.object({
  portfolioId: z.string(),
  positions: z
    .array(AddPositionSchema)
    .max(100, 'A maximum of 100 positions can be added at a time.'),
})

const RemovePositionSchema = z.object({
  stockId: z.string(),
})

export const RemovePortfolioPositionSchema = z.object({
  portfolioId: z.string(),
  positions: z
    .array(RemovePositionSchema)
    .max(100, 'A maximum of 100 positions can be removed at a time.'),
})

export const DeletePortfolioSchema = z.object({
  portfolioId: z.string(),
})

export const PortfolioHistorySchema = z.object({
  portfolioId: z.string(),
  options: z
    .object({
      excludeQuantity: z.boolean().optional(),
    })
    .optional(),
})

export type CreatePortfolioProps = z.infer<typeof CreatePortfolioSchema>
export type UpdatePortfolioProps = z.infer<typeof UpdatePortfolioSchema>
export type AddPortfolioPositionProps = z.infer<
  typeof AddPortfolioPositionSchema
>
export type RemovePortfolioPositionProps = z.infer<
  typeof RemovePortfolioPositionSchema
>
export type DeletePortfolioProps = z.infer<typeof DeletePortfolioSchema>
export type PortfolioHistoryProps = z.infer<typeof PortfolioHistorySchema>
