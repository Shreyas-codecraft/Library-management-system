import { BookRepository } from "../book-management/book.repository";
import { formatDate } from "../core/formatdate";
import { IPageRequest, IPagesResponse } from "../core/pagination";
import { IRepository } from "../core/repository";
import { MemberRepository } from "../member-management/member.repository";
import { ITransactionBase, ITransaction } from "./models/transaction.model";
import { MySql2Database } from "drizzle-orm/mysql2";
import { Books, Transactions } from "../src/drizzle/schema";
import { count, eq, like, or } from "drizzle-orm";
import { CountResult } from "../core/ReturTypes";
import { error } from "node:console";

export class TransactionRepository
  implements IRepository<ITransactionBase, ITransaction>
{
  async getAllTransactions() {
    const transactions: ITransaction[] = await this.db
      .select()
      .from(Transactions);
    return transactions;
  }
  async getTotalCount() {
    let countResult;
    [countResult] = await this.db.select({ count: count() }).from(Transactions);
    return countResult.count;
  }
  constructor(private db: MySql2Database<Record<string, never>>) {}

  async create(data: ITransactionBase): Promise<ITransaction | null> {
    const currentDate = new Date();
    const dueDays = 7;
    const dueDate = new Date(currentDate);
    dueDate.setDate(currentDate.getDate() + dueDays);
    const transaction: Omit<ITransaction, "id"> = {
      bookId: data.bookId,
      memberId: data.memberId,
      issueDate: formatDate(currentDate),
      dueDate: formatDate(dueDate),
      returnDate: null,
      Status: "Issued",
    };
    const createdTransaction: ITransaction | undefined =
      await this.db.transaction(async (trx) => {
        try {
          const [result] = await trx
            .insert(Transactions)
            .values(transaction)
            .$returningId();
          const [createdTransaction] = await trx
            .select()
            .from(Transactions)
            .where(eq(Transactions.id, result.id));
          const [book] = await trx
            .select()
            .from(Books)
            .where(eq(Books.id, transaction.bookId));
          if (transaction.Status === "Issued" && book) {
            await trx
              .update(Books)
              .set({
                availableNumberOfCopies: book.availableNumberOfCopies - 1,
              })
              .where(eq(Books.id, transaction.bookId));
            return createdTransaction;
          }
        } catch (err) {
          throw err;
        }
      });
    return createdTransaction!;
  }

  async update(
    id: number,
    transaction: ITransactionBase
  ): Promise<ITransaction | null> {
    // const newTransaction = await this.db.transaction(async (trx) => {
    //   const [book] = await this.db
    //     .select()
    //     .from(Books)
    //     .where(eq(Books.id, transaction.bookId));
    //   await this.db
    //     .update(Books)
    //     .set({ availableNumberOfCopies: book.availableNumberOfCopies + 1 });
    //   await this.db
    //     .update(Transactions)
    //     .set({ returnDate: formatDate(new Date()), Status: "Returned" });

    //   return transaction as ITransaction;
    // });
    // return newTransaction;
    throw new error
  }
  delete(id: number): Promise<ITransaction | null> {
    throw new Error("Method not implemented.");
  }
  async getById(id: number): Promise<ITransaction | null> {
    const [transaction]: ITransaction[] = await this.db
      .select()
      .from(Transactions)
      .where(eq(Transactions.id, id));
    return transaction;
  }
  async list(params: IPageRequest): Promise<IPagesResponse<ITransaction>> {
    const search = params.search?.toLocaleLowerCase();
    let selectSql: ITransaction[];
    let countResult: CountResult;

    try {
      if (search) {
        selectSql = await this.db
          .select()
          .from(Transactions)
          .where(
            or(
              like(Transactions.bookId, search),
              like(Transactions.memberId, search)
            )
          )
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      } else {
        selectSql = await this.db
          .select()
          .from(Transactions)
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      }

      [countResult] = await this.db
        .select({ count: count() })
        .from(Transactions)
        .where(
          search
            ? or(
                like(Transactions.memberId, search),
                like(Transactions.bookId, search)
              )
            : undefined
        );

      const countTransaction = (countResult as any).count;

      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: countTransaction,
        },
      };
    } catch (error) {
      throw new Error("Not found");
    }
  }
}
