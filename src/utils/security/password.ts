import bcryptjs from 'bcryptjs'

export const saltAndHashPassword = async (password: string) => {
  return await bcryptjs.hash(password, 10)
}
