import { compare, genSalt, hash } from "bcryptjs"

const SALT_RANDOMS = 8

const hashPassword = async (password: string) => {
  const saltGenerated = await genSalt(SALT_RANDOMS)
  const hashedPassword = await hash(password, saltGenerated)
  return hashedPassword
}

const verifyPassword = async (password: string, hashedPassword: string) => {
  return await compare(password, hashedPassword)
}

export const PasswordCryto = {
  hashPassword,
  verifyPassword
}