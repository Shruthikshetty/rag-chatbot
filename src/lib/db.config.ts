import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env" });

//@ts-expect-error - data base connection
const sql = neon(process.env.NEON_DATABASE_URL);

export const db = drizzle(sql);
