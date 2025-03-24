import { z } from 'zod';

export const UpdateUserSchema = z.object({
  biography: z.string().optional(),
  name: z.string().optional(),
  publicProfile: z.enum(['public', 'private']).optional(),
});

export type UpdateUserProps = z.infer<typeof UpdateUserSchema>;
