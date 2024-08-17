import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NextFunction, Request, Response, Router } from "express"; // Import types
import bcrypt from "bcrypt";
import { MemberRepository } from "../member-management/member.repository";
import { IMemberBase } from "../member-management/models/member.model";
// import Request from ""
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = "34rtfg6yhj8ik";
const REFRESH_SECRET = "34rtfg6yhj8ik";

const pool = mysql.createPool(
  "mysql://root:root_password@localhost:3306/librarydb"
);
const db = drizzle(pool);
const repo = new MemberRepository(db);


// export const handleLogin = async (req: Request, res: Response) => {
//   console.log("login");
//   const body = req.body;
//   const user = body.username;
//   const pwd = body.password;
//   if (!user || !pwd) {
//     return res
//       .status(400)
//       .json({ message: "Username and password are required." });
//   }

//   const foundUser = await repo.getByUserName(user);
//   if (!foundUser) return res.sendStatus(401); //Unauthorized
//   // evaluate password
//   const match = await bcrypt.compare(pwd, foundUser.password);
//   if (match) {
//     // create JWTs
//     const accessToken = jwt.sign({ id: foundUser.id }, JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     const refreshToken = jwt.sign(
//       { username: foundUser.firstName },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//     await repo.update(foundUser.id, {
//       email: undefined,
//       firstName: undefined,
//       lastName: undefined,
//       password: undefined,
//       phoneNumber: undefined,
//       refreshToken: refreshToken,
//     } as unknown as IMemberBase);
//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     res.json({ accessToken });
//   } else {
//     res.sendStatus(401);
//   }
// };

export const handleLogin = async (req: Request, res: Response) => {
  console.log("login");
  const body = req.body;
  const user = body.username;
  const pwd = body.password;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const foundUser = await repo.getByUserName(user);
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign({ id: foundUser.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { username: foundUser.firstName },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    await repo.update(foundUser.id, {
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      password: undefined,
      phoneNumber: undefined,
      refreshToken: refreshToken,
    } as unknown as IMemberBase);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};


