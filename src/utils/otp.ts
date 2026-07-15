import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import db from "@/db";
import { OtpTable } from "@/db/schema/auth-profiles/otp";
import { HttpError } from "@/errors/http-error";

const OTP_TTL_MINUTES = 10;

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function createOtp(userId: string) {
  // Invalide les codes précédents encore actifs pour ce user
  await db
    .update(OtpTable)
    .set({ utilise: true })
    .where(and(eq(OtpTable.id_user, userId), eq(OtpTable.utilise, false)));

  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await db.insert(OtpTable).values({
    id: crypto.randomUUID(),
    id_user: userId,
    code_hash: hashCode(code),
    date_expiration: expiresAt.toISOString(),
  });

  return code;
}

export async function verifyOtp(userId: string, code: string) {
  const [stored] = await db
    .select()
    .from(OtpTable)
    .where(
      and(
        eq(OtpTable.id_user, userId),
        eq(OtpTable.code_hash, hashCode(code)),
        eq(OtpTable.utilise, false),
      ),
    );

  if (!stored) {
    throw new HttpError(401, "Code OTP invalide");
  }

  if (new Date(stored.date_expiration) < new Date()) {
    throw new HttpError(401, "Code OTP expiré");
  }

  await db.update(OtpTable).set({ utilise: true }).where(eq(OtpTable.id, stored.id));

  return stored;
}
