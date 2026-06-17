import serverEnv from "@/config/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(serverEnv.DATABASE_URL, {
  max: serverEnv.NODE_ENV === "production" ? 10 : undefined,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client, { schema });

export type Database = typeof db;
export { client };
export default db;