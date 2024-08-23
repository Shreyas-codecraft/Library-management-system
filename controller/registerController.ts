import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NextFunction, Request, Response, Router } from "express"; // Import types
import bcrypt from "bcrypt";
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

export const handleNewUser = async (req: Request, res: Response) => {
  const body = req.body;
  const user = body.firstName;
  const pwd = body.password;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
  try {
    // Check for duplicate usernames in the db\
    const duplicate = await repo.getByEmail(body.email);
    if (duplicate) return res.sendStatus(409); //Conflict

    // Encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = { ...body, password: hashedPwd };

    // Store the new user in the database
    const member= await repo.create(newUser);
    // console.log(member)
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

