'use server'

import { getUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { UpdateUserProps, UpdateUserSchema } from '@/lib/validators/user'

/**
 * Update user information.
 * @param values `UpdateUserSchema` validator
 * @returns Success or error JSON object
 */
export const updateUser = async (values: UpdateUserProps) => {
  const validatedFields = UpdateUserSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('updateUser (invalid_fields): values=%so', values)
    return { error: 'Invalid fields.' }
  }

  const { name } = validatedFields.data

  const user = await getUser()
  if (!user) {
    return { error: 'Unauthorized.' }
  }

  await db.user.update({
    where: { id: user?.id },
    data: {
      ...(name && { name }),
    },
  })

  logger.debug('updateUser (done): userId=%s, name=%s', user?.id, name)
  return { success: 'User updated successfully.' }
}
