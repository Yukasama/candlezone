import { OrderSchemaWithoutId } from '@/features/order/lib/validators';
import { z } from 'zod';

const TitleSchema = z
  .string()
  .max(25, 'Title must be at most 25 characters long.');

export const CreatePortfolioSchema = z.object({
  title: TitleSchema.min(1, 'Title must be at least 1 character long.'),
  isPublic: z.boolean().default(false),
  color: z.string().optional(),
  orders: z.array(OrderSchemaWithoutId).optional(),
});

export const UpdatePortfolioSchema = z.object({
  portfolioId: z.string(),
  title: TitleSchema.optional(),
  isPublic: z.boolean().optional(),
  color: z.string().optional(),
});

export const DeletePortfolioSchema = z.object({
  portfolioId: z.string(),
});

export const PortfolioHistorySchema = z.object({
  portfolioId: z.string(),
  options: z
    .object({
      excludeQuantity: z.boolean().default(false),
      showRealizedPL: z.boolean().default(true),
    })
    .optional(),
});

export type CreatePortfolioProps = z.infer<typeof CreatePortfolioSchema>;
export type UpdatePortfolioProps = z.infer<typeof UpdatePortfolioSchema>;
export type DeletePortfolioProps = z.infer<typeof DeletePortfolioSchema>;
export type PortfolioHistoryProps = z.infer<typeof PortfolioHistorySchema>;
