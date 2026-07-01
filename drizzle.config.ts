import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Required for db:migrate / db:push / db:studio. db:generate works without it.
    url: process.env.DATABASE_URL ?? "",
  },
});
