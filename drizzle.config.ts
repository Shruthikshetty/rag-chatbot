import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/lib/db.schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    //@ts-ignore
    url: process.env.NEON_DATABASE_URL!,
  },
});
