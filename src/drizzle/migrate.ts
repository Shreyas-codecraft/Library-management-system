import mysql from "mysql2/promise";
import { Appenv } from "../../read-env";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";

async function main() {
  const migrateClient = mysql.createPool(
    "mysql://root:root_password@localhost:3306/librarydb"
  );
  const db = drizzle(migrateClient);
  await migrate(db, {
    migrationsFolder:
      "/home/shreyas/cc-5/cc5-ds-algorithms/Library-management/Library-Management-System/src/drizzle/migrations",
  });
  await migrateClient.end();
}

main();
