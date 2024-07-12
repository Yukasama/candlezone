'use server'

import { getUser } from '@/lib/auth'

export const getClientUser = async () => {
  return await getUser()
}
