'use server';

import { getUser } from '@/features/auth/actions/get-user';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Delete a user.
 * @returns Success or error JSON object
 */
export const deleteUser = async () => {
  const user = await getUser();
  if (!user) {
    return { error: 'Unauthorized.' };
  }

  await db.user.delete({
    where: { id: user.id },
  });

  logger.debug('deleteUser (done): userId=%s', user.id);
  return { success: 'User deleted successfully.' };
};
