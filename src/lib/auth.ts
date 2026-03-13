import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE_NAME = "rbn_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 horas

const SESSION_SECRET = process.env.AUTH_SECRET || "change-me-in-production";

type SessionPayload = {
  userId: string;
  exp: number;
};

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 310000, 32, "sha256")
    .toString("hex");
  return `${salt}:${hash}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto
    .pbkdf2Sync(password, salt, 310000, 32, "sha256")
    .toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(check, "hex"),
  );
}

function signSession(payload: SessionPayload): string {
  const body = JSON.stringify(payload);
  const bodyB64 = Buffer.from(body).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(bodyB64)
    .digest("base64url");
  return `${bodyB64}.${sig}`;
}

function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [bodyB64, sig] = token.split(".");
  if (!bodyB64 || !sig) return null;
  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(bodyB64)
    .digest("base64url");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(bodyB64, "base64url").toString(),
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const exp = Date.now() + SESSION_TTL_MS;
  const token = signSession({ userId, exp });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}
