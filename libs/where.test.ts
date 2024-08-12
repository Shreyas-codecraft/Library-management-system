// import { MySqlQueryGenerator } from "./ mysql-query-generator";
// import { describe, test, expect } from "vitest";
// import {
//   OrWhereExpression,
//   SimpleWhereExpression,
//   WhereExpression,
// } from "./types";
// import { IBook } from "../book-management/models/books.model";

// describe("generateSelectSql", () => {
//   const whereExp: WhereExpression<IBook> = {
//     OR: [
//       {
//         OR: [
//           {
//             author: {
//               op: "EQUALS",
//               value: "Sudha Murthy",
//             },
//           },
//           {
//             totalNumOfCopies: {
//               op: "GREATER_THAN_EQUALS",
//               value: 10,
//             },
//           },
//         ],
//       },
//       {
//         author: {
//           op: "CONTAINS",
//           value: "Sudha Murthy",
//         },
//       },
//       {
//         publisher: {
//           op: "EQUALS",
//           value: "Penguin UK",
//         },
//       },
//     ],
//   };
//   test("should generate correct where clause", () => {
//     const data: string[] = [];
//     const authAndPublisherQuery =
//       MySqlQueryGenerator.generateWhereClauseSql<IBook>(whereExp, data);
//   });

//   test("tests for update query", () => {
//     const updateData = {
//       id: 1,
//       genre: "asdfg",
//     };
//     const updateSql = MySqlQueryGenerator.generateUpdateSql(
//       "Books",
//       updateData,
//       whereExp
//     );
//     console.log(updateSql);
//   });
// });
