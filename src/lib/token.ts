import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { tokenConfig } from "@/config/token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await db.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await db.verificationToken.delete({
      where: { token: existingToken.token },
    });
  }

  const twoFactorToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await db.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await db.verificationToken.delete({
      where: { token: existingToken.token },
    });
  }

  const passwordResetToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + tokenConfig.verifyTokenExpiry);

  const existingToken = await db.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await db.verificationToken.delete({
      where: { token: existingToken.token },
    });
  }

  const verficationToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verficationToken;
};
