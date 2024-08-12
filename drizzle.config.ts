import { defineConfig } from "drizzle-kit";
import { AppEnv, Appenv } from "./read-env";
export default defineConfig({
  schema:
    "/home/shreyas/cc-5/cc5-ds-algorithms/Library-management/Library-Management-System/src/drizzle/schema.ts",
  out: "/home/shreyas/cc-5/cc5-ds-algorithms/Library-management/Library-Management-System/src/drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://root:root_password@localhost:3306/librarydb",
  },
  verbose: true,
  strict: true,
});
