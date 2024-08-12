import {
  AndWhereExpression,
  ColumnData,
  Data,
  OrWhereExpression,
  PageOption,
  ReturnedResult as ReturnedResult,
  SimpleWhereExpression,
  WhereExpression,
  WhereParamValue,
} from "./types";
import { LibraryDataset } from "../db/library-dataset";

const generateWhereClauseSql = <T>(
  whereParams: WhereExpression<T>,
  data: Data
): ReturnedResult => {
  const processSimpleExp = (
    exp: SimpleWhereExpression<T>,
    data: Data
  ): ReturnedResult => {
    const whereQuery = Object.entries(exp)
      .map(([key, opts]) => {
        const columnName = `\`${key}\``;
        const paramValue: WhereParamValue = opts as WhereParamValue;

        let paramPlaceHolder;
        let value = paramValue.value;
        let operator = "";

        if (paramValue.value === null) {
          if (paramValue.op === "EQUALS") {
            operator = " IS ";
          } else {
            operator = " IS NOT ";
          }
        } else {
          switch (paramValue.op) {
            case "EQUALS":
              operator = " = ";
              break;

            case "NOT_EQUALS":
              operator = " != ";
              break;

            case "STARTS_WITH":
              operator = " LIKE ";
              value = `${value}%`;
              break;

            case "NOT_STARTS_WITH":
              operator = " NOT LIKE ";
              value = `${value}%`;
              break;

            case "ENDS_WITH":
              operator = " LIKE ";
              value = `%${value}`;
              break;

            case "NOT_ENDS_WITH":
              operator = " NOT LIKE ";
              value = `%${value}`;
              break;

            case "CONTAINS":
              operator = " LIKE ";
              value = `%${value}%`;
              break;

            case "NOT_CONTAINS":
              operator = " NOT LIKE ";
              value = `%${value}%`;
              break;

            case "GREATER_THAN":
              operator = " > ";
              break;

            case "GREATER_THAN_EQUALS":
              operator = " >= ";
              break;

            case "LESSER_THAN":
              operator = " < ";
              break;

            case "LESSER_THAN_EQUALS":
              operator = " <= ";
              break;

            case "IN":
              operator = " IN ";
              if (Array.isArray(value)) {
                paramPlaceHolder = `(${value.map((v) => "?").join(", ")})`;
                data.push(...value);
              }
              break;

            case "NOT_IN":
              operator = " NOT IN ";
              if (Array.isArray(value)) {
                paramPlaceHolder = `(${value.map((v) => "?").join(", ")})`;
                data.push(...value);
              }
              break;
          }
        }
        if (!Array.isArray(value)) data.push(value);
        return `${columnName} ${operator} ${
          Array.isArray(value) ? paramPlaceHolder : "?"
        }`;
      })
      .join(" AND ");
    return { query: whereQuery, data: data };
  };
  const whKeys = Object.keys(whereParams);

  if (whKeys.includes("AND")) {
    //it's an AndWhereExpression
    const andClause = (whereParams as AndWhereExpression<T>).AND.map((exp) =>
      generateWhereClauseSql(exp, data)
    ).filter((c) => c.query);
    const query = andClause.map((exp) => exp.query).join(" AND ");

    return query
      ? ({ query: `(${query})`, data: data } as ReturnedResult)
      : { query: ``, data: data };
  } else if (whKeys.includes("OR")) {
    //it's an OrWhereExpression
    const orClause = (whereParams as OrWhereExpression<T>).OR.map((exp) =>
      generateWhereClauseSql(exp, data)
    ).filter((c) => c.query);
    const query = orClause.map((exp) => exp.query).join(" OR ");

    return query
      ? ({ query: `(${query})`, data: data } as ReturnedResult)
      : { query: ``, data: data };
  } else {
    //it's a SimpleWhereExpression
    const simpleClause = processSimpleExp(
      whereParams as SimpleWhereExpression<T>,
      data
    );
    return simpleClause.query
      ? ({
          query: `(${simpleClause.query})`,
          data: simpleClause.data,
        } as ReturnedResult)
      : {
          query: ``,
          data: simpleClause.data,
        };
  }
};

const generateInsertSql = <T>(
  tableName: keyof LibraryDataset,
  row: Omit<T, "id">
): ReturnedResult => {
  let sql = "";
  let data: Data = [];
  const columnValue = Object.entries(row as object).reduce(
    (acc, [key, value]) => {
      acc.columns.push(key);
      acc.values.push("?");
      data.push(value);
      return acc;
    },
    {
      columns: new Array<string>(),
      values: new Array<string>(),
    }
  );
  sql = `INSERT INTO \`${tableName}\` (${columnValue.columns.join(
    ", "
  )}) VALUES(${columnValue.values.join(", ")})`;
  return { query: sql, data: data };
};

function sanitizeField(field: string): string {
  if (field.startsWith("`") && field.endsWith("`")) {
    return field;
  }
  return `\`${field}\``;
}

// * ((cond1 AND cond2 AND cond3 AND ...) AND (condA AND condB AND condC AND ...)) OR (condX ...)

const generateUpdateSql = <T>(
  tableName: keyof LibraryDataset,
  row: Partial<T>,
  where: WhereExpression<T>
): ReturnedResult => {
  let sql = "";
  let data: Data = [];
  const update = Object.entries(row as object).reduce((acc, [key, value]) => {
    acc.push(`\`${key}\`=?`);
    data.push(value);
    return acc;
  }, new Array<string>());

  const whereClause = generateWhereClauseSql(where, []);
  data.push(...whereClause.data);
  sql = `UPDATE \`${tableName}\` SET ${update.join(", ")} WHERE ${whereClause.query}`;
  return { query: sql, data: data };
};

const generateDeleteSql = <T>(
  tableName: string,
  where: WhereExpression<T>
): ReturnedResult => {
  let sql = "";
  const whereClause = generateWhereClauseSql(where, []);
  sql = `DELETE FROM \`${tableName}\` WHERE ${whereClause.query}`;
  return { query: sql, data: whereClause.data };
};

const generateSelectSql = <T>(
  tableName: keyof LibraryDataset,
  columnNames?: (keyof T)[],
  where?: WhereExpression<T>,
  pagination?: PageOption
): ReturnedResult => {
  let sql;
  const columns =
    columnNames && columnNames.length > 0 ? columnNames.join(", ") : "*";
  let whereClause: ReturnedResult = { query: "", data: [] };
  let data: Data = [];
  if (where) {
    whereClause = generateWhereClauseSql(where, []);

    sql = `SELECT ${columns} FROM ${tableName} WHERE ${whereClause.query}`;
  } else {
    sql = `SELECT ${columns} FROM ${tableName}`;
  }
  data.push(...whereClause.data);
  if (typeof pagination !== "undefined") {
    sql += ` LIMIT ?`;
    data.push(pagination.limit);
    console.log(pagination.offset);
    if (pagination.offset !== undefined) {
      sql += ` OFFSET ?`;
      data.push(pagination.offset);
    }
  }

  return { query: sql, data: data };
};

const generateCountSql = <T>(
  tableName: keyof LibraryDataset,
  where?: WhereExpression<T>,
  columnName?: keyof T
): ReturnedResult => {
  let whereClause;
  let sql;
  const column = columnName ? `\`${String(columnName)}\`` : "*";
  sql = `SELECT COUNT(${column}) AS count FROM \`${tableName}\``;
  if (where) {
    whereClause = generateWhereClauseSql(where, []);
    sql += `WHERE ${whereClause.query}`;
    return { query: sql, data: whereClause.data };
  }
  return { query: sql, data: [] };
};

export const MySqlQueryGenerator = {
  generateWhereClauseSql,
  generateInsertSql,
  generateUpdateSql,
  generateDeleteSql,
  generateSelectSql,
  generateCountSql,
};
