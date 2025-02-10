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
  const { data, error, success } = UpdateUserSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'updateUser (invalid_data): values=%o, issues=%o',
      values,
      error.flatten().fieldErrors,
    );
    return { error: 'Invalid data.' };
  }

  const { biography, name } = data;

  const user = await getUser();
  if (!user) {
    return { error: 'Unauthorized.' };
  }

  await db.user.update({
    data: {
      ...(name && { name }),
      ...(biography && { biography }),
    },
    where: { id: user.id },
  });

  revalidatePath('/settings/profile');
  logger.debug('updateUser (done): userId=%s, data=%o', user.id, data);
  return { success: 'User updated successfully.' };
};
