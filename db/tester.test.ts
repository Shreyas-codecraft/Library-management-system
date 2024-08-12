import { test, expect, describe } from "vitest";
import { MySQLAdapter } from "./sqldb";
import { Appenv } from "../read-env";
import { MySqlQueryGenerator } from "../libs/ mysql-query-generator";
import { WhereExpression } from "../libs/types";
import { IBook } from "../book-management/models/books.model";
import { MySQLDatabase } from "./sql-ds";
import "dotenv/config";
import { LibraryDataset } from "./library-dataset";
import { ConnectionPoolFactory } from "./mysql-connection";

describe("tests", async () => {
  let mySQLAdapter: MySQLAdapter;
  mySQLAdapter = new MySQLAdapter({
    dbURL: Appenv.DATABASE_URL,
  });
  const db = new MySQLDatabase<LibraryDataset>(mySQLAdapter);

  test("should generate correct SQL for SELECT", async () => {
    const whereParams: WhereExpression<IBook> = {
      id: {
        op: "EQUALS",
        value: 177,
      },
    };

    const query = await db.select("Books", [], whereParams, {
      limit: 1,
      offset: 0,
    });
    console.log("----------------------", query);
  });

  test.skip("should generate correct SQL for INSERT", async () => {
    const userData = {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      publisher: "T. Egerton, Whitehall",
      genre: "Romance",
      isbnNo: "9780143105428",
      numOfPages: 279,
      totalNumOfCopies: 6,
      availableNumberOfCopies: 4,
    };
    const whereParams: WhereExpression<IBook> = {
      title: {
        op: "EQUALS",
        value: "1984",
      },
    };
    const result = await db.insert("Books", userData);
  });

  test("should delete a row from the table", async () => {
    const whereParams: WhereExpression<IBook> = {
      id: {
        op: "EQUALS",
        value: 11,
      },
    };
    const deleted = await db.delete("Books", whereParams);
    console.log("=====>", deleted);
  });

  test("should count the specified rows from the table", async () => {
    const whereParams: WhereExpression<IBook> = {
      id: {
        op: "EQUALS",
        value: 1,
      },
    };
    const count = await db.count("Books");
    console.log(count);
  });

  test("should update rows in Table", async () => {
    const whereParams: WhereExpression<IBook> = {
      id: { op: "EQUALS", value: 1 },
    };
    const updateData: Partial<IBook> = {
      author: "Jane Doe",
      title: "The Great Gatsby",
    };
    await db.update("Books", updateData, whereParams);
  });
});
