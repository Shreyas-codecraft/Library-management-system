import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NextFunction, Request, Response, Router } from "express"; // Import types
import { MemberRepository } from "../member-management/member.repository";
import { IMemberBase } from "../member-management/models/member.model";
// import Request from ""
require("dotenv").config();

const pool = mysql.createPool(
  "mysql://root:root_password@localhost:3306/librarydb"
);
const db = drizzle(pool);
const repo = new MemberRepository(db);

export const handleLogout = async (req: Request, res: Response) => {
  // On client, also delete the accessToken
  console.log("logout");

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(200).json({ message: "User already logged out" });
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  try {
    const foundUser = await repo.getByRefreshToken(refreshToken);
    if (!foundUser) {
      console.log("inside if");

      res.clearCookie("jwt", { httpOnly: true, secure:true,sameSite:'none' });
      if (!cookies?.jwt) return res.status(200).json({ message: "User already logged out" });
    }

    // Delete refreshToken in db
    await repo.update(foundUser!.id, {
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      password: undefined,
      phoneNumber: undefined,
      refreshToken: "",
    } as unknown as IMemberBase);
    res.status(200).json({ message: "user logged out successfully" });
  } catch (err) {
    res.sendStatus(500);
  }
};
