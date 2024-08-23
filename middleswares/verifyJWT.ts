import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NextFunction, Request, Response, Router } from "express"; // Import types
import { MemberRepository } from "../member-management/member.repository";
import { Appenv } from "../read-env";
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = Appenv.JWT_SECRET;
const REFRESH_SECRET = Appenv.REFRESH_SECRET;

const pool = mysql.createPool(
  "mysql://root:root_password@localhost:3306/librarydb"
);
const db = drizzle(pool);

export const router = Router();
export const verifyJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("verify");
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, JWT_SECRET, (err: unknown, decoded: any) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }
        req.id = decoded.id;
        next();
      });
    } else {
      res.status(401).json({ message: "Authorization token required" });
    }
  };