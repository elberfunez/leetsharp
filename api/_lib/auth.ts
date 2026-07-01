/**
 * Shared auth for the serverless API. Files/dirs under /api prefixed with `_`
 * are NOT deployed as routes by Vercel — this is a helper module.
 *
 * Flow: the browser sends the Clerk session JWT as `Authorization: Bearer <token>`.
 * We verify it with the Clerk secret key (no network round-trip for the verify
 * itself — it's a signature check against Clerk's JWKS), then lazily upsert a
 * minimal `users` row from the Clerk profile on first authenticated action.
 */
import type { VercelRequest } from "@vercel/node";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { db, users, type User } from "../../db";

const secretKey = process.env.CLERK_SECRET_KEY ?? "";
const clerk = createClerkClient({ secretKey });

/** Thrown for auth failures; handlers map `.status` onto the HTTP response. */
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function bearerToken(req: VercelRequest): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

/**
 * Verify the caller's Clerk session and return their `users` row, creating it
 * on first call. Throws `HttpError(401)` if unauthenticated.
 */
export async function requireUser(req: VercelRequest): Promise<User> {
  const token = bearerToken(req);
  if (!token) throw new HttpError(401, "Not signed in");

  let userId: string;
  try {
    const claims = await verifyToken(token, { secretKey });
    userId = claims.sub;
  } catch {
    throw new HttpError(401, "Invalid or expired session");
  }

  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (existing.length) return existing[0];

  // First authenticated action: pull the GitHub identity from Clerk and store it.
  const profile = await clerk.users.getUser(userId);
  const github = profile.externalAccounts.find((a) => a.provider.includes("github"));
  const githubLogin = github?.username ?? null;
  const name = profile.fullName ?? githubLogin;

  const [row] = await db
    .insert(users)
    .values({ id: userId, githubLogin, name })
    .onConflictDoUpdate({ target: users.id, set: { githubLogin, name } })
    .returning();
  return row;
}

/** Like `requireUser`, but additionally requires the admin role (403 otherwise). */
export async function requireAdmin(req: VercelRequest): Promise<User> {
  const user = await requireUser(req);
  if (user.role !== "admin") throw new HttpError(403, "Admin only");
  return user;
}
