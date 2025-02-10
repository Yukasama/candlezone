'use server';

import { getUser } from '@/features/auth/actions/get-user';
import {
  UpdateUserProps,
  UpdateUserSchema,
} from '@/features/user/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

/**
 * Update user information.
 * @param values `UpdateUserSchema` validator
 * @returns Success or error JSON object
 */
export const updateUser = async (values: UpdateUserProps) => {
  const { data, success, error } = UpdateUserSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'updateUser (invalid_data): values=%o, issues=%o',
      values,
      error.flatten().fieldErrors,
    );
    return { error: 'Invalid data.' };
  }

  const { name, biography } = data;

  const user = await getUser();
  if (!user) {
    return { error: 'Unauthorized.' };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      ...(name && { name }),
      ...(biography && { biography }),
    },
  });

  revalidatePath('/settings/profile');
  logger.debug('updateUser (done): userId=%s, data=%o', user.id, data);
  return { success: 'User updated successfully.' };
};
