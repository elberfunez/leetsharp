/**
 * Neon-backed Drizzle client. Imported only by serverless functions under
 * `/api` — never by the browser bundle. Throws at import time if the connection
 * string is missing, which is the right behavior for a serverless function
 * (env is always present in prod) and never affects local `npm run dev`, since
 * the frontend doesn't import this module.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set — required for database access.");
}

export const db = drizzle(neon(url), { schema });
export * from "./schema";
