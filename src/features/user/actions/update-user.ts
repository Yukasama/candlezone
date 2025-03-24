'use server';

import { getUser } from '@/features/auth/actions/get-user';
import {
  UpdateUserProps,
  UpdateUserSchema,
} from '@/features/user/lib/validators';
import { db } from '@/lib/db';
import { ERROR_CODES } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';
import { revalidatePath } from 'next/cache';

/**
 * Update user information.
 * @param values `UpdateUserSchema` validator
 * @returns Success or error JSON object
 */
export const updateUser = async (values: UpdateUserProps) => {
  const { biography, name, publicProfile } = validateSchema({
    fnName: 'updateUser',
    schema: UpdateUserSchema,
    values,
  });
  const logContext = { biography, name, publicProfile };

  const user = await getUser();
  if (!user) {
    return { error: ERROR_CODES.UNAUTHORIZED };
  }

  await db.user.update({
    data: {
      ...(name && { name }),
      ...(biography && { biography }),
      ...(publicProfile && {
        publicProfile: publicProfile === 'public' ? new Date() : null,
      }),
    },
    where: { id: user.id },
  });

  revalidatePath('/settings/profile');
  logger.debug('updateUser (done): userId=%s, data=%o', user.id, logContext);
  return { success: true };
};
