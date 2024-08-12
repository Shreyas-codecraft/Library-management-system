// import { MySqlQueryGenerator } from "./ mysql-query-generator";
// import { describe, test, expect } from "vitest";
// import {
//   OrWhereExpression,
//   SimpleWhereExpression,
//   WhereExpression,
// } from "./types";
// import { IBook } from "../book-management/models/books.model";

// describe("MySqlQueryGenerator", () => {
//   const tableName = "Books";

//   test("should generate correct SQL for INSERT", () => {
//     const userData = {
//       id: 1,
//       title: "The Great Gatsby",
//       author: "F. Scott Fitzgerald",
//       publisher: "Charles Scribner's Sons",
//       genre: "Fiction",
//       isbnNo: "9780743273565",
//       numOfPages: 180,
//       totalNumOfCopies: 5,
//       availableNumberOfCopies: 3,
//     };

//     const generatedInsertSql = MySqlQueryGenerator.generateInsertSql<
//       Omit<IBook, "id">
//     >(tableName, userData);
//     const expectedInsertSql = {
//       query:
//         "INSERT INTO `Books` (id, title, author, publisher, genre, isbnNo, numOfPages, totalNumOfCopies, availableNumberOfCopies) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
//       data: [
//         1,
//         "The Great Gatsby",
//         "F. Scott Fitzgerald",
//         "Charles Scribner's Sons",
//         "Fiction", // genre
//         "9780743273565",
//         180,
//         5,
//         3,
//       ],
//     };

//     expect(generatedInsertSql).toEqual(expectedInsertSql);
//     console.log(generatedInsertSql);
//   });

//   test("should generate correct SQL for UPDATE", () => {
//     const updateData: Partial<IBook> = {
//       author: "Jane Doe",
//       title: "The Great Gatsby",
//     };
//     const whereParams: WhereExpression<IBook> = {
//       id: { op: "EQUALS", value: 1 },
//     };

//     const expectedUpdateSql = {
//       query: "UPDATE `Books` SET author=?, title=? WHERE (`id`  =  ?)",
//       data: ["Jane Doe", "The Great Gatsby", 1],
//     };

//     const generatedUpdateSql = MySqlQueryGenerator.generateUpdateSql(
//       tableName,
//       updateData,
//       whereParams
//     );

//     expect(generatedUpdateSql).toEqual(expectedUpdateSql);
//     console.log(generatedUpdateSql);
//   });

//   test("should generate correct SQL for DELETE", () => {
//     const whereParams: WhereExpression<IBook> = {
//       id: { op: "EQUALS", value: 1 },
//     };

//     const generatedDeleteSql = MySqlQueryGenerator.generateDeleteSql(
//       tableName,
//       whereParams
//     );

//     console.log(generatedDeleteSql);
//   });

//   test("should generate correct SQL for SELECT", () => {
//     const whereParams: WhereExpression<IBook> = {
//       id: { op: "EQUALS", value: 1 },
//     };

//     const expectedSelectSql = {
//       query: "SELECT * FROM Books WHERE (`id`  =  ?) LIMIT ? OFFSET ?",
//       data: [1, 10, 0],
//     };

//     const generatedSelectSql = MySqlQueryGenerator.generateSelectSql<IBook>(
//       tableName,
//       [],
//       whereParams,
//       { limit: 10, offset: 0 }
//     );

//     expect(generatedSelectSql).toEqual(expectedSelectSql);
//     console.log(generatedSelectSql);
//   });

//   test("test for IN", () => {
//     const whereParams: WhereExpression<IBook> = {
//       id: { op: "IN", value: [1, 2, 3, 4, 5] },
//     };
//     const where = MySqlQueryGenerator.generateWhereClauseSql(whereParams, []);
//     console.log(where);
//   });

//   test("test for nested query", () => {
//     const whereParams: WhereExpression<IBook> = {
//       id: {
//         op: "IN",
//         value: "SELECT ID from Books WHERE ISBN = 1234567890234",
//       },
//     };
//     const where = MySqlQueryGenerator.generateWhereClauseSql(whereParams, []);
//     console.log(where);
//   });

//   //   describe("generateCountSql", () => {
//   //     test("should generate correct SQL for COUNT", () => {
//   //       const whereParams = { id: { op: "EQUALS", value: 1 } };
//   //       const expectedSql = "SELECT COUNT(*) FROM `users` WHERE (`id`  =  1)";
//   //       const countSql = MySqlQueryGenerator.generateCountSql(
//   //         tableName,
//   //         whereParams
//   //       );
//   //       expect(countSql).toEqual(expectedSql);
//   //     });
//   //   });
//   // });

//   // describe("tests for books", () => {
//   //   test("tests", () => {
//   //     const whereCondition: SimpleWhereExpression<IBook> = {
//   //       author: {
//   //         op: "CONTAINS",
//   //         value: "Sudha Murthy",
//   //       },
//   //     };
//   //     const queryStr =
//   //       MySqlQueryGenerator.generateWhereClauseSql<IBook>(whereCondition);
//   //     expect(queryStr).toEqual('(`author`  LIKE  "%Sudha Murthy%")');
//   //   });

//   //   test("tests for AND", () => {
//   //     const authAndPublisher: SimpleWhereExpression<IBook> = {
//   //       author: {
//   //         op: "CONTAINS",
//   //         value: "Sudha Murthy",
//   //       },
//   //       publisher: {
//   //         op: "EQUALS",
//   //         value: "Penguin UK",
//   //       },
//   //     };
//   //     const authAndPublisherQuery =
//   //       MySqlQueryGenerator.generateWhereClauseSql<IBook>(authAndPublisher);
//   //     expect(authAndPublisherQuery).toEqual(
//   //       '(`author`  LIKE  "%Sudha Murthy%" AND `publisher`  =  "Penguin UK")'
//   //     );
//   //   });
//   //   test("tests for OR", () => {
//   //     const authAndPublisher: WhereExpression<IBook> = {
//   //       OR: [
//   //         {
//   //           author: {
//   //             op: "CONTAINS",
//   //             value: "Sudha Murthy",
//   //           },
//   //         },
//   //         {
//   //           publisher: {
//   //             op: "EQUALS",
//   //             value: "Penguin UK",
//   //           },
//   //         },
//   //       ],
//   //     };
//   //     const authAndPublisherQuery =
//   //       MySqlQueryGenerator.generateWhereClauseSql<IBook>(authAndPublisher);
//   //     expect(authAndPublisherQuery).toEqual(
//   //       '((`author`  LIKE  "%Sudha Murthy%") OR (`publisher`  =  "Penguin UK"))'
//   //     );

//   //     const authOrCopies: OrWhereExpression<IBook> = {
//   //       OR: [
//   //         {
//   //           author: {
//   //             op: "EQUALS",
//   //             value: "Sudha Murthy",
//   //           },
//   //           totalNumOfCopies: {
//   //             op: "GREATER_THAN_EQUALS",
//   //             value: 10,
//   //           },
//   //         },
//   //       ],
//   //     };
//   //     const authAndCopiesQuery =
//   //       MySqlQueryGenerator.generateWhereClauseSql<IBook>(authOrCopies);
//   //     expect(authAndCopiesQuery).toEqual(
//   //       '((`author`  =  "Sudha Murthy" AND `totalNumOfCopies`  >=  10))'
//   //     );
//   //   });
//   //   test("where clause generation", () => {});

//   //   test("select tests", () => {
//   //     const authOrCopies: OrWhereExpression<IBook> = {
//   //       OR: [
//   //         {
//   //           author: {
//   //             op: "EQUALS",
//   //             value: "Sudha Murthy",
//   //           },
//   //           totalNumOfCopies: {
//   //             op: "GREATER_THAN_EQUALS",
//   //             value: 10,
//   //           },
//   //         },
//   //       ],
//   //     };
//   //     const selectByAuthor = MySqlQueryGenerator.generateSelectSql<IBook>(
//   //       "book",
//   //       authOrCopies,
//   //       0,
//   //       10,
//   //       ["author", "availableNumberOfCopies"]
//   //     );
//   //     expect(selectByAuthor).toBe(
//   //       'SELECT author, availableNumberOfCopies FROM book WHERE ((`author`  =  "Sudha Murthy" AND `totalNumOfCopies`  >=  10)) LIMIT 10 OFFSET 0'
//   //     );
//   //   });
// });
