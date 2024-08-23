import {
  bigint,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";
export const Books = mysqlTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  publisher: varchar("publisher", { length: 100 }).notNull(),
  genre: varchar("genre", { length: 100 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 13 }).unique().notNull(),
  numOfPages: int("numOfPages").notNull(),
  totalNumOfCopies: int("totalNumOfCopies").notNull(),
  availableNumberOfCopies: int("availableNumberOfCopies").notNull(),
});
export const Members = mysqlTable("members", {
  id: serial("id").primaryKey().notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  phoneNumber: varchar("phoneNumber", { length: 10 }).notNull(),
  password:varchar("password",{length:150}).notNull(),
  refreshToken:varchar("refreshToken",{length:255}).notNull(),
  accessToken:varchar("accessToken",{length:255}).notNull(),
  user_id:varchar("user_id",{length:255}).notNull(),
  role:varchar("role",{length:255}).notNull(),

});
export const Transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey().notNull(),
  bookId: int("bookId")
    .references(() => Books.id)
    .notNull(),
  memberId: int("memberId")
    .references(() => Members.id)
    .notNull(),
  issueDate: varchar("issueDate", { length: 100 }).notNull(),
  dueDate: varchar("dueDate", { length: 100 }).notNull(),
  returnDate: varchar("returnDate", { length: 100 }),
  Status: mysqlEnum("Status", ["Issued", "Returned"]).notNull(),
});
