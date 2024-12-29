'use server';

import {
  UpdateUserProps,
  UpdateUserSchema,
} from '@/features/user/lib/validators';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

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
      error.issues,
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

  logger.debug('updateUser (done): userId=%s, data=%o', user.id, data);
  return { success: 'User updated successfully.' };
};
