import { IPageRequest, IPagesResponse } from "../core/pagination";
import { IRepository } from "../core/repository";
import { IBook, IBookBase, bookSchema } from "./models/books.model";
import { Books, Members, Transactions } from "../src/drizzle/schema";
import { MySql2Database } from "drizzle-orm/mysql2";
import { count, eq, like, or } from "drizzle-orm";
import { CountResult } from "../core/ReturTypes";

export class BookRepository implements IRepository<IBookBase, IBook> {
  constructor(private db: MySql2Database<Record<string, never>>) {}

  async create(data: IBookBase): Promise<IBook | null> {
    const bookData: Omit<IBook, "id"> = {
      ...data,
      availableNumberOfCopies: data.totalNumOfCopies,
    };
    try {
      const [result] = await this.db
        .insert(Books)
        .values(bookData)
        .$returningId();
      const [book]: IBook[] = await this.db
        .select()
        .from(Books)
        .where(eq(Books.id, result.id));
      return book;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, data: IBookBase): Promise<IBook | null> {
    const toBeUpdated = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined)
    );
    try {
      await this.db.update(Books).set(toBeUpdated).where(eq(Books.id, id));
      const [result]: IBook[] = await this.db
        .select()
        .from(Books)
        .where(eq(Books.id, id));

      if (Array.isArray(result) && result.length === 0) {
        return null;
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number): Promise<IBook | null> {
    try {
      await this.db.delete(Books).where(eq(Books.id, id));
      return null;
    } catch (err) {
      throw err;
    }
  }

  async getById(id: number): Promise<IBook | null> {
    try {
      const [result]: IBook[] = await this.db
        .select()
        .from(Books)
        .where(eq(Books.id, id));
      return result;
    } catch (err) {
      throw err;
    }
  }

  
  
  async list(params: IPageRequest): Promise<IPagesResponse<IBook>> {
    const search = params.search?.toLocaleLowerCase();
    let selectSql: IBook[];
    let countResult: CountResult;

    try {
      // Building the query based on search and pagination parameters
      if (search) {
        selectSql = await this.db
          .select()
          .from(Books)
          .where(or(like(Books.title, search), like(Books.isbnNo, search)))
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      } else {
        selectSql = await this.db
          .select()
          .from(Books)
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      }

      [countResult] = await this.db
        .select({ count: count() })
        .from(Books)
        .where(
          search
            ? or(like(Books.title, search), like(Books.isbnNo, search))
            : undefined
        );

      const countBook = (countResult as any).count;

      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: countBook,
        },
      };
    } catch (error) {
      throw new Error("Not found");
    }
  }

  async getTotalCount(): Promise<any> {
    let countResult;
    try {
      [countResult] = await this.db.select({ count: count() }).from(Books);

      const countBook = (countResult as any).count;
      return countBook;
    } catch (err) {
      throw err;
    }
  }
}
