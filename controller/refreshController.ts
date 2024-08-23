import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NextFunction, Request, Response, Router } from "express";
import { MemberRepository } from "../member-management/member.repository";
import { Appenv } from "../read-env";
// import Request from ""
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = Appenv.JWT_SECRET;
const REFRESH_SECRET = Appenv.REFRESH_SECRET;

const pool = mysql.createPool(
  "mysql://root:root_password@localhost:3306/librarydb"
);
const db = drizzle(pool);
const repo = new MemberRepository(db);

export const handleRefreshToken = async (req: Request, res: Response) => {
  console.log("refresh");
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await repo.getByRefreshToken(refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, REFRESH_SECRET, (err: unknown, decoded: any) => {
    if (err || foundUser.firstName !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign({ username: decoded.username }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ accessToken });
  });
};
