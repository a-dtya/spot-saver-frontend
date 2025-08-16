import {defineConfig} from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
export default defineConfig({
  schema: "./src/lib/schema.ts",   // where we'll define tables
  out: "./drizzle",                // migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Supabase DB URL
  },
});
