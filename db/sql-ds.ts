import { MySQLAdapter } from "./sqldb";
import { PageOption, WhereExpression } from "../libs/types";
import { MySqlQueryGenerator } from "../libs/ mysql-query-generator";
import { Appenv } from "../read-env";
import { LibraryDataset } from "./library-dataset";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { ConnectionPoolFactory } from "./mysql-connection";

export class MySQLDatabase<DS> {
  constructor(private mySQLAdapter: MySQLAdapter) {}

  async select<T extends keyof DS>(
    tableName: T,
    columnNames?: (keyof DS[T])[],
    where?: WhereExpression<DS[T]>,
    pagination?: PageOption
  ): Promise<DS[T][] | null> {
    const selectSql = MySqlQueryGenerator.generateSelectSql(
      tableName,
      columnNames,
      where,
      pagination
    );
    const connection = this.mySQLAdapter.acquireConnection();
    const result = await (
      await connection
    ).query(selectSql.query, selectSql.data);
    if (Array.isArray(result) && result.length === 0) {
      return null;
    }
    return result as DS[T][];
  }

  async insert<T extends keyof DS>(
    tableName: T,
    row: Omit<DS[T], "id">
  ): Promise<QueryResult[]> {
    const insertSql = MySqlQueryGenerator.generateInsertSql(
      tableName as string,
      row
    );
    const connection = this.mySQLAdapter.acquireConnection();
    const result = await (
      await connection
    ).query(insertSql.query, insertSql.data);
    return result as QueryResult[];
  }

  async delete<T extends keyof DS>(
    tableName: T,
    where: WhereExpression<DS[T]>
  ): Promise<QueryResult> {
    const deleteSql = MySqlQueryGenerator.generateDeleteSql(
      tableName as string,
      where
    );

    const connection = this.mySQLAdapter.acquireConnection();
    const result = await (
      await connection
    ).query(deleteSql.query, deleteSql.data);
    return result as QueryResult;
  }

  async count<T extends keyof DS>(
    tableName: T,
    where?: WhereExpression<DS[T]>,
    columnName?: keyof DS[T]
  ): Promise<RowDataPacket[]> {
    const countSql = MySqlQueryGenerator.generateCountSql(
      tableName as string,
      where,
      columnName
    );
    const connection = await this.mySQLAdapter.acquireConnection();
    const [result]: [RowDataPacket[], any] = await connection.query(
      countSql.query,
      countSql.data
    );
    console.log(result);

    // if (Array.isArray(result)) {
    //   console.log(result);
    //   return result[0].count;
    // }
    return result;
  }

  async update<T extends keyof DS>(
    tableName: T,
    row: Partial<DS[T]>,
    where: WhereExpression<DS[T]>
  ): Promise<ResultSetHeader> {
    const updateSql = MySqlQueryGenerator.generateUpdateSql<DS[T]>(
      tableName as string,
      row,
      where
    );
    const connection = this.mySQLAdapter.acquireConnection();
    const result = await (
      await connection
    ).query(updateSql.query, updateSql.data);
    return result as ResultSetHeader;
  }
}
