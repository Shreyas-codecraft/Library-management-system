import { beforeEach, describe, expect, test, afterEach } from "vitest";
import { BookRepository } from "./book.repository";
import { Database } from "../db/ds";
import { IBook, IBookBase } from "./models/books.model";
import { faker } from "@faker-js/faker";
import { LibraryDataset } from "../db/library-dataset";
import { rm } from "fs/promises";
import { ConnectionPoolFactory } from "../db/mysql-connection";
import { Appenv } from "../read-env";

describe("Book Repository Tests", () => {
  let connectionPoolFactory: ConnectionPoolFactory;
  connectionPoolFactory = new ConnectionPoolFactory({
    dbURL: Appenv.DATABASE_URL,
  });
  const bookRepository = new BookRepository(connectionPoolFactory);

  afterEach(async () => {});
  test("Create single book ", async () => {
    const connection = connectionPoolFactory.acquireTransactionConnection();
  });

  // test("Create books", () => {
  //   let booksCount = books.length;
  //   books.forEach((book) => {
  //     bookRepository.create(book);
  //   });
  //   expect(bookRepository.list({ offset: 0, limit: 100 }).items.length).toBe(
  //     booksCount
  //   );
  // });
  // test("Update the Book details", async () => {
  //   const newBook: IBook = await bookRepository.create(books[0]);
  //   expect(newBook).toBeDefined();
  //   newBook.title = "To Save a Mockingbird";
  //   const updatedBook = await bookRepository.update(newBook.id, newBook);
  //   expect(updatedBook).toBeDefined();
  //   expect(updatedBook?.title).toBe("To Save a Mockingbird");
  //   await bookRepository.deleteAll();
  // });
  // test("Get book by its id", async () => {
  //   const newBook: IBook = await bookRepository.create(books[0]);
  //   const fetchedBook = await bookRepository.getById(newBook.id);
  //   expect(fetchedBook?.id).toBe(newBook.id);
  // });
  // test("Get a list of added books", async () => {
  //   const newBook1 = await bookRepository.create(books[0]);
  //   const newBook2 = await bookRepository.create(books[1]);
  //   const newBook3 = await bookRepository.create(books[2]);
  //   const listOfBooks = bookRepository.list({ offset: 0, limit: 3 });
  //   expect(listOfBooks.items).toEqual([
  //     {
  //       ...newBook1,
  //       availableNumberOfCopies: newBook1.totalNumOfCopies,
  //     },
  //     {
  //       ...newBook2,
  //       availableNumberOfCopies: newBook2.totalNumOfCopies,
  //     },
  //     {
  //       ...newBook3,
  //       availableNumberOfCopies: newBook3.totalNumOfCopies,
  //     },
  //   ]);
  // });
  // test("Delete a book from the list", async () => {
  //   const newBook1 = await bookRepository.create(books[0]);
  //   const newBook2 = await bookRepository.create(books[1]);
  //   await bookRepository.delete(newBook1.id);
  //   const listOfBooks = await bookRepository.list({ offset: 0, limit: 3 });
  //   expect(listOfBooks.items.length).toBe(1);
  //   expect(listOfBooks.items[0].id).toBe(newBook2.id);
  // });
  // test("Delete all the books", async () => {
  //   await bookRepository.deleteAll();
  //   expect(bookRepository.list({ offset: 0, limit: 1 }).items.length).toBe(0);
  // });
});
