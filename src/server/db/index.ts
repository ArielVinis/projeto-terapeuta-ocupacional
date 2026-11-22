import { env } from "@/src/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set — DB calls will fail until configured.");
}

const client = postgres(connectionString ?? "postgresql://localhost:5432/placeholder", {
  prepare: false,
  max: 1,
});

export const db = drizzle(client, { schema, casing: "snake_case" });
