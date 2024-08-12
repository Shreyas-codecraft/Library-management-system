import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { Books } from "./schema";
import { eq, count } from "drizzle-orm"; // Import `count` from `drizzle-orm`

async function main() {
  const pool = mysql.createPool(
    "mysql://root:root_password@localhost:3306/librarydb"
  );
  const db = drizzle(pool);

  try {
    // Update operation
    const updateResult = await db
      .update(Books)
      .set({ numOfPages: 600 })
      .where(eq(Books.id, 2));
    console.log("Update Result:", updateResult);

    // Count operation
    const countResult = await db.select({ count: count() }).from(Books); // Specify the table for counting
    console.log("Count Result:", countResult);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await pool.end();
  }
}

main();
