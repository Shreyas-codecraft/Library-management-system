import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NextFunction, Request, Response, Router } from "express"; // Import types
import { MemberRepository } from "../member-management/member.repository";

const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = "34rtfg6yhj8ik";

const pool = mysql.createPool(
  "mysql://root:root_password@localhost:3306/librarydb"
);
const db = drizzle(pool);
const repo = new MemberRepository(db);

export const router = Router();
export const ensureAdmin = async (
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
        req.role = decoded.role;
        next();
      });
    } else {
      res.status(401).json({ message: "Authorization token required" });
    }
  };