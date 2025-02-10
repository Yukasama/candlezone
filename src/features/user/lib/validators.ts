import { z } from 'zod';

export const UpdateUserSchema = z.object({
  biography: z.string().optional(),
  name: z.string().optional(),
});

export type UpdateUserProps = z.infer<typeof UpdateUserSchema>;
