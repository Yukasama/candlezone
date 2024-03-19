import { db } from "@/lib/db";
import { getUser } from "../auth";

export const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string | undefined) => {
  return await db.user.findUnique({ where: { id } });
};
