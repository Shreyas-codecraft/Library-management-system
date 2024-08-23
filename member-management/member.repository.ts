import { IPageRequest, IPagesResponse } from "../core/pagination";
import { IRepository } from "../core/repository";
import { IMemberBase, IMember } from "./models/member.model";
import { MySql2Database } from "drizzle-orm/mysql2";
import { Members } from "../src/drizzle/schema";
import { count, eq, like, or } from "drizzle-orm";
import { CountResult } from "../core/ReturTypes";

export class MemberRepository implements IRepository<IMemberBase, IMember> {
  constructor(private db: MySql2Database<Record<string, never>>) {}
  async create(data: IMemberBase): Promise<IMember | null> {
    try {
      const [result] = await this.db
        .insert(Members)
        .values({
          ...data,
        })
        .$returningId();
      const [member]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.id, result.id));
      return member;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, data: IMemberBase): Promise<IMember | null> {
    const toBeUpdated = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined || value !== "")
    );

    try {
      await this.db.update(Members).set(toBeUpdated).where(eq(Members.id, id));
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.id, id));

      if (Array.isArray(result) && result.length === 0) {
        return null;
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number): Promise<IMember | null> {
    try {
      await this.db.delete(Members).where(eq(Members.id, id));
      return null;
    } catch (err) {
      throw err;
    }
  }
  async getById(id: number): Promise<IMember | null> {
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.id, id));
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getByUserId(user_id: string): Promise<IMember | null> {
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.user_id, user_id));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getByUserName(name:string){
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.firstName, name));
      return result;
    } catch (err) {
      throw err;
    }
  }

  

  async getByEmail(email:string): Promise<IMember | null>{
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.email, email));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getByRefreshToken(refreshToken:string): Promise<IMember | null>{
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.refreshToken, refreshToken));
      return result;
    } catch (err) {
      throw err;
    }
  }
  async list(params: IPageRequest): Promise<IPagesResponse<IMember>> {
    const search = params.search?.toLocaleLowerCase();
    let selectSql: IMember[];
    let countResult: CountResult;

    try {
      // Building the query based on search and pagination parameters
      if (search) {
        selectSql = await this.db
          .select()
          .from(Members)
          .where(
            or(
              like(Members.email, search),
              like(Members.lastName, search),
              like(Members.firstName, search)
            )
          )
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      } else {
        selectSql = await this.db
          .select()
          .from(Members)
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      }

      // Counting the total number of results
      [countResult] = await this.db
        .select({ count: count() })
        .from(Members)
        .where(
          search
            ? or(
                like(Members.email, search),
                like(Members.lastName, search),
                like(Members.firstName, search)
              )
            : undefined
        );

      const countBook = (countResult as any).count;

      // Return the results and pagination information
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
      [countResult] = await this.db.select({ count: count() }).from(Members);

      const countMember = (countResult as any).count;
      return countMember;
    } catch (err) {
      throw err;
    }
  }

  // async create(data: IMemberBase): Promise<IMember> {
  //   const connection = await this.db.acquireTransactionConnection();
  //   const member: Omit<IMember, "id"> = { ...data };
  //   const insertSql = MySqlQueryGenerator.generateInsertSql<IMember>(
  //     "Members",
  //     member
  //   );
  //   try {
  //     const res = await connection.query(insertSql.query, insertSql.data);
  //     const where: WhereExpression<IMember> = {
  //       id: { op: "EQUALS", value: `${(res as any).insertId}` },
  //     };
  //     const selectSql = MySqlQueryGenerator.generateSelectSql<IMember>(
  //       "Members",
  //       undefined,
  //       where,
  //       undefined
  //     );
  //     const [result] = (await connection.query(
  //       selectSql.query,
  //       selectSql.data
  //     )) as IMember[];
  //     await connection.commit();

  //     return result;
  //   } catch (err) {
  //     await connection.rollback();
  //     throw err;
  //   } finally {
  //     connection.release();
  //   }
  // }
  // async update(id: number, data: IMemberBase): Promise<IMember | null> {
  //   const toBeUpdated = Object.fromEntries(
  //     Object.entries(data).filter(([key, value]) => value !== undefined)
  //   );
  //   const connection = await this.mySQLAdapter.acquireTransactionConnection();
  //   connection.initialize();
  //   console.log(this.mySQLAdapter.pool);

  //   const where: WhereExpression<IMember> = {
  //     id: { op: "EQUALS", value: id },
  //   };
  //   const updateSql = MySqlQueryGenerator.generateUpdateSql<IMember>(
  //     "Members",
  //     toBeUpdated,
  //     where
  //   );

  //   try {
  //     console.log("started");
  //     console.log(updateSql.query, updateSql.data);
  //     await connection.query(updateSql.query, updateSql.data);
  //     console.log("ended");
  //     const selectSql = MySqlQueryGenerator.generateSelectSql<IMember>(
  //       "Members",
  //       undefined,
  //       where
  //     );
  //     const result: IMember[] = (await connection.query(
  //       selectSql.query,
  //       selectSql.data
  //     )) as IMember[];
  //     if (Array.isArray(result) && result.length === 0) {
  //       return null;
  //     }
  //     connection.commit();
  //     return result[0];
  //   } catch (err) {
  //     connection.rollback();
  //     console.log("--------------------->");
  //     throw err;
  //   } finally {
  //     connection.release();
  //   }
  //   return null;
  // }
  // async delete(id: number): Promise<IMember | null> {
  //   const connection = await this.mySQLAdapter.acquireTransactionConnection();
  //   const where: WhereExpression<IMember> = {
  //     id: { op: "EQUALS", value: id },
  //   };
  //   const deleteSql = MySqlQueryGenerator.generateDeleteSql<IMember>(
  //     "Members",
  //     where
  //   );

  //   try {
  //     await connection.query(deleteSql.query, deleteSql.data);
  //     connection.commit();
  //     return null;
  //   } catch (err) {
  //     await connection.rollback();
  //     throw err;
  //   } finally {
  //     connection.release();
  //   }
  //   return null;
  // }
  // async getById(id: number): Promise<IMember | null> {
  //   const connection = await this.mySQLAdapter.acquireConnection();
  //   const where: WhereExpression<IMember> = {
  //     id: { op: "EQUALS", value: `${id}` },
  //   };
  //   const selectSql = MySqlQueryGenerator.generateSelectSql<IMember>(
  //     "Members",
  //     undefined,
  //     where,
  //     undefined
  //   );

  //   try {
  //     const [result] = (await connection.query(
  //       selectSql.query,
  //       selectSql.data
  //     )) as IMember[];
  //     if (Array.isArray(result) && result.length === 0) {
  //       return null;
  //     }
  //     return result;
  //   } finally {
  //     connection.release();
  //   }
  // }
  // async list(params: IPageRequest): Promise<IPagesResponse<IMember>> {
  //   const search = params.search?.toLocaleLowerCase();
  //   let where: WhereExpression<IMember> | undefined = undefined;
  //   if (search) {
  //     where = {
  //       OR: [
  //         { email: { op: "CONTAINS", value: search } },
  //         { firstName: { op: "CONTAINS", value: search } },
  //         { lastName: { op: "CONTAINS", value: search } },
  //       ],
  //     };
  //   }

  //   const pagination = {
  //     limit: params.limit,
  //     offset: params.offset,
  //   };
  //   const selectSql = MySqlQueryGenerator.generateSelectSql<IMember>(
  //     "Members",
  //     undefined,
  //     where,
  //     pagination
  //   );
  //   const connection = await this.mySQLAdapter.acquireConnection();

  //   try {
  //     const filteredMembers = (await connection.query(
  //       selectSql.query,
  //       selectSql.data
  //     )) as IMember[];
  //     const countSql = MySqlQueryGenerator.generateCountSql<IMember>(
  //       "Members",
  //       where
  //     );

  //     const result1 = await connection.query(countSql.query, countSql.data);

  //     const countBook = (result1 as Array<any>)[0].count;

  //     if (filteredMembers) {
  //       return {
  //         items: filteredMembers,
  //         pagination: {
  //           offset: params.offset,
  //           limit: params.limit,
  //           total: countBook,
  //         },
  //       };
  //     }
  //     throw new Error("Not found");
  //   } finally {
  //     connection.release();
  //   }
  // }

  // async getTotalCount(): Promise<any> {
  //   const countSql = MySqlQueryGenerator.generateCountSql<IMember>(
  //     "Members",
  //     undefined,
  //     undefined
  //   );
  //   const connection = await this.mySQLAdapter.acquireConnection();

  //   try {
  //     const result1 = await connection.query(countSql.query, countSql.data);
  //     const countBook = (result1 as any)[0].count;

  //     return countBook;
  //   } finally {
  //     connection.release();
  //   }
  // }
}
