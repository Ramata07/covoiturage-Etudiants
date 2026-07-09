import crypto from "crypto";
import { eq } from "drizzle-orm";
import db from "@/db";
import { RefreshTokenTable } from "@/db/schema/auth-profiles/refresh-token";
import { HttpError } from "@/errors/http-error";

const REFRESH_TOKEN_TTL_DAYS = 30;

function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function createRefreshToken(userId: string) {
  const rawToken = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(RefreshTokenTable).values({
    id: crypto.randomUUID(),
    id_user: userId,
    token_hash: hashToken(rawToken),
    date_expiration: expiresAt.toISOString(),
  });

  return rawToken;
}

export async function verifyRefreshToken(rawToken: string) {
  const [stored] = await db
    .select()
    .from(RefreshTokenTable)
    .where(eq(RefreshTokenTable.token_hash, hashToken(rawToken)));

  if (!stored || stored.invalider_token) {
    throw new HttpError(401, "Refresh token invalide");
  }

  if (new Date(stored.date_expiration) < new Date()) {
    throw new HttpError(401, "Refresh token expiré");
  }

  return stored;
}

export async function revokeRefreshToken(id: string) {
  await db.update(RefreshTokenTable).set({ invalider_token: true }).where(eq(RefreshTokenTable.id, id));
}
