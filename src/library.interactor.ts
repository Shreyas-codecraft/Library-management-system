import { join } from "node:path";
import { BookInteractor } from "../book-management/book.interactor";
import { IInteractor } from "../core/interactor";
import { Menu } from "../core/menu";
import { LibraryDataset } from "../db/library-dataset";
import { MemberInteractor } from "../member-management/member.interactor";
import { TransactionInteractor } from "../transaction-management/transaction.interactor";
import { MySQLAdapter } from "../db/sqldb";
import { MySQLDatabase } from "../db/sql-ds";

import chalk from "chalk";
import { Appenv } from "../read-env";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
export class LibraryInteractor implements IInteractor {
  menu = new Menu("Library-Management", [
    { key: "1", label: "Book Management" },
    { key: "2", label: "Member Management" },
    { key: "3", label: "Transaction" },
    { key: "4", label: "Exit" },
  ]);
  constructor() {}
  async showMenu(): Promise<void> {
    const pool = mysql.createPool(
      "mysql://root:root_password@localhost:3306/librarydb"
    );
    const db = drizzle(pool);
    let loop = true;
    while (loop) {
      const op = await this.menu.show();
      if (op) {
        switch (op?.key.toLocaleLowerCase()) {
          case "1":
            const bookInteractor = new BookInteractor(this, db);
            await bookInteractor.showMenu();
            break;
          case "2":
            const memberInteractor = new MemberInteractor(this, db);
            await memberInteractor.showMenu();
            break;

          case "3":
            const transactionInteractor = new TransactionInteractor(this, db);
            await transactionInteractor.showMenu();
            break;

          case "4":
            process.exit(0);
            break;
        }
      } else {
        console.log(
          chalk.bold.red("\nInvalid option, Please Enter valid option\n")
        );
      }
    }
  }
}
