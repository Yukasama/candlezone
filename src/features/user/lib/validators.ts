import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  biography: z.string().optional(),
});

export type UpdateUserProps = z.infer<typeof UpdateUserSchema>;
