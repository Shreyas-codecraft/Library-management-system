import { test, expect, describe, beforeAll } from "vitest";
import { Appenv } from "../read-env"; // Make sure this correctly imports and uses process.env
import "dotenv/config";
import { MySQLAdapter } from "./sqldb";
import { MySqlQueryGenerator } from "../libs/ mysql-query-generator";
import { WhereExpression } from "../libs/types";
import { IBook } from "../book-management/models/books.model";
import { I } from "vitest/dist/reporters-yx5ZTtEV";

describe("mysql db adapter tests", () => {
  let mySQLAdapter: MySQLAdapter;
  const tableName = "Books";

  beforeAll(async () => {
    mySQLAdapter = new MySQLAdapter({
      dbURL: Appenv.DATABASE_URL,
    });
  });

  test("should generate correct SQL for SELECT", async () => {
    const whereParams: WhereExpression<IBook> = {
      id: { op: "EQUALS", value: 10 },
    };

    const selectSql = MySqlQueryGenerator.generateSelectSql<IBook>(
      tableName,
      [],
      whereParams,
      { limit: 10, offset: 0 }
    );
    console.log(selectSql);

    let result = await mySQLAdapter.runQuery(selectSql.query, selectSql.data);
  });
});
