import { migrate } from "drizzle-orm/postgres-js/migrator";
import db, { client } from ".";

const migrationsFolder = "./src/db/migrations";

if (!process.env.DB_MIGRATING) {
  throw new Error(
    'You must set DB_MIGRATING to "true" when running migrations',
  );
}

const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder });
  } finally {
    await client.end();
  }
};

void runMigrations().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});