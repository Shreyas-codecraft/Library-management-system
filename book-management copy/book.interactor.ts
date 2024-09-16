import { ZodError } from "zod";
import { NumberParser, readLine, StringParser } from "../core/input.utils";
import { IInteractor } from "../core/interactor";
import { Menu } from "../core/menu";
import { BookRepository } from "./book.repository";
import { IBook, IBookBase, bookSchema } from "./models/books.model";
import chalk from "chalk";
import { LibraryInteractor } from "../src/library.interactor";
import { viewCompleteList } from "../core/pagination";
import "dotenv/config";
import { ConnectionPoolFactory } from "../db/mysql-connection";
import { MySql2Database } from "drizzle-orm/mysql2";

export class BookInteractor implements IInteractor {
  menu = new Menu("Book-Management", [
    { key: "1", label: "Add Book" },
    { key: "2", label: "Edit Book" },
    { key: "3", label: "Search Book" },
    { key: "4", label: "List Books" },
    { key: "5", label: "Delete Book" },
    { key: "6", label: chalk.yellow("<Previous Menu>") },
  ]);

  constructor(
    public libraryInteractor: LibraryInteractor,
    private db: MySql2Database<Record<string, never>>
  ) {}

  private repo = new BookRepository(this.db);
  async showMenu(): Promise<void> {
    while (true) {
      const op = await this.menu.show();
      if (op) {
        switch (op?.key.toLocaleLowerCase()) {
          case "1":
            await addBook(this.repo);
            break;
          case "2":
            await updateBook(this.repo);
            break;
          case "3":
            await searchBook(this.repo);
            break;
          case "4":
            await listOfBooks(this.repo);
            break;
          case "5":
            await deleteBook(this.repo);
            break;
          case "6":
            await this.libraryInteractor.showMenu();
          default:
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
async function getBookInput(book?: IBookBase) {
  const toBeUpdated: { [key: string]: any } = {};
  const title = await readLine(
    `Please Enter the Title ${book?.title ?? ""} :`,
    StringParser(true, !!book)
  );
  toBeUpdated["title"] = title || undefined;

  const author = await readLine(
    `Please Enter the Author ${book?.author ?? ""} : `,
    StringParser(true, !!book)
  );
  toBeUpdated["author"] = author || undefined;

  const publisher = await readLine(
    `Please Enter the Publisher: ${book?.publisher ?? ""} : `,
    StringParser(true, !!book)
  );
  toBeUpdated["publisher"] = publisher || undefined;

  const genre = await readLine(
    `Please Enter the Genre ${book?.genre ?? ""} : `,
    StringParser(true, !!book)
  );
  toBeUpdated["genre"] = genre || undefined;

  const isbnNo = await readLine(
    `Please Enter the ISBN: ${book?.isbnNo ?? ""} : `,
    StringParser(true, !!book)
  );
  toBeUpdated["isbnNo"] = isbnNo || undefined;

  const numOfPages = await readLine(
    `Please Enter the Number of Pages: ${book?.numOfPages ?? ""} : `,
    NumberParser(!!book)
  );
  toBeUpdated["numOfPages"] = numOfPages || undefined;

  let totalNumOfCopies = book?.totalNumOfCopies;
  if (book) {
    return toBeUpdated as IBookBase;
  }
  if (!totalNumOfCopies) {
    totalNumOfCopies = (await readLine(
      `Please Enter the Total Number of Copies:  `,
      NumberParser()
    ))!;
  }

  return {
    title: title!,
    author: author!,
    publisher: publisher!,
    genre: genre!,
    isbnNo: isbnNo!,
    numOfPages: numOfPages!,
    totalNumOfCopies: totalNumOfCopies!,
  };
}

async function addBook(repo: BookRepository) {
  while (true) {
    try {
      const book: IBookBase = await getBookInput();
      const validatedBook = bookSchema.parse(book);
      const createdBook = await repo.create(validatedBook as IBookBase);
      chalk.green(
        console.log(`Book added successfully!\nBook ID:${createdBook!.id}`)
      );
      console.table(createdBook);
      break;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.log(
          chalk.red("\nData is invalid! Please enter the valid data")
        );
        const errors = (error as any).flatten().fieldErrors;
        Object.entries(errors).forEach((e) => {
          console.log(`${e[0]}: ${chalk.red(e[1])}`);
        });
      }
    }
  }
}

async function updateBook(repo: BookRepository) {
  let loop = true;
  while (loop) {
    const bookId: number | null = await readLine(
      "Please Enter the Book ID : ",
      NumberParser()
    );
    const currentBook: IBook | null = await repo.getById(bookId!);
    console.log(currentBook);
    if (!currentBook) {
      console.log(chalk.red("Please Enter valid Book Id"));
      continue;
    } else {
      loop = false;
      const book: IBookBase = await getBookInput(currentBook);
      const updatedBook = await repo.update(bookId!, book);
      console.table(updatedBook);
    }
  }
}

async function searchBook(repo: BookRepository): Promise<IBook | null> {
  while (true) {
    const id = await readLine("Please Enter the Book Id:", NumberParser());
    const book = await repo.getById(id!);
    if (!book) {
      console.log(
        chalk.bold.red("\nNo Book found!!  Please Enter Valid Book ID!!!\n")
      );
      continue;
    } else {
      console.table(book);
      return book;
    }
  }
}

async function deleteBook(repo: BookRepository) {
  while (true) {
    const id = await readLine("Please Enter the Book Id:", NumberParser());
    const book = await repo.getById(id!);
    console.table(book);
    if (!book) {
      console.log(
        chalk.bold.red("\nNo Book found!!  Please Enter Valid Book ID!!!\n")
      );
      continue;
    } else {
      repo.delete(id!);
      console.log(
        chalk.bold.green(`Book with a Id ${id} deleted successfully\n`)
      );
      break;
    }
  }
}

async function listOfBooks(repo: BookRepository) {
  const search = await readLine(
    "\nPlease Enter the Search Text (You can search by title or ISBN number ):",
    StringParser(true, true)
  );
  const offset =
    (await readLine(
      "Please enter the search offset value (this determines where to start the search from, e.g., 1 for the beginning):",
      NumberParser(true)
    ))! || 0;
  const limit =
    (await readLine(
      "Please enter the search limit value (this determines the number of results to return):",
      NumberParser(true)
    ))! || 10;
  console.log(search);
  if (search) {
    repo.list({ search: search, offset: offset, limit: limit });
  } else {
    repo.list({ search: undefined, offset: offset, limit: limit });
  }

  const totalBooks = await repo.getTotalCount();

  await viewCompleteList<IBookBase, IBook>(
    repo,
    offset,
    limit,
    totalBooks,
    search
  );
}

// export interface IPageRequest {
//   search?: string;
//   offset: number;
//   limit: number;
// }
