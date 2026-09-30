import { SignJWT, jwtVerify } from "jose";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { env } from "$env/dynamic/private";

function getSecret() {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(env.JWT_SECRET);
}

export function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const [salt, key] = hash.split(":");
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err);
      else {
        try {
          resolve(timingSafeEqual(Buffer.from(key, "hex"), derived));
        } catch {
          resolve(false);
        }
      }
    });
  });
}

export type TokenPayload = {
  userId: string;
  orgId: string | null;
  role: string | null;
};

export function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as string,
      orgId: payload.orgId as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}
