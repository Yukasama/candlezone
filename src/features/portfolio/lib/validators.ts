import { OrderSchemaWithoutId } from '@/features/order/lib/validators';
import { z } from 'zod';

const TitleSchema = z
  .string()
  .regex(
    /^[\w\s\-!?.]+$/,
    'Title can only contain letters, numbers, spaces, and -_!?.',
  )
  .max(25, 'Title must be at most 25 characters long.');

export const CreatePortfolioSchema = z.object({
  color: z.string().optional(),
  isPublic: z.date().optional(),
  orders: z.array(OrderSchemaWithoutId).optional(),
  title: TitleSchema.min(1, 'Title must be at least 1 character long.'),
});

export const UpdatePortfolioSchema = z.object({
  color: z.string().optional(),
  isPublic: z.date().optional(),
  portfolioId: z.string(),
  title: TitleSchema.optional(),
});

export const DeletePortfolioSchema = z.object({
  portfolioId: z.string(),
});

export const PortfolioHistorySchema = z.object({
  options: z
    .object({
      excludeQuantity: z.boolean().default(false),
      showRealizedPL: z.boolean().default(true),
    })
    .optional(),
  portfolioId: z.string(),
});

export type CreatePortfolioProps = z.infer<typeof CreatePortfolioSchema>;
export type DeletePortfolioProps = z.infer<typeof DeletePortfolioSchema>;
export type PortfolioHistoryProps = z.infer<typeof PortfolioHistorySchema>;
export type UpdatePortfolioProps = z.infer<typeof UpdatePortfolioSchema>;
