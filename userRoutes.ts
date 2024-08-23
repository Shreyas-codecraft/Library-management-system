import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NextFunction, Request, Response, Router } from "express"; // Import types
import bcrypt from "bcrypt";
import { MemberRepository } from "./member-management/member.repository";
import { IMemberBase } from "./member-management/models/member.model";
import cookieParser from "cookie-parser";
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

export const router = Router();
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
    await repo.create(newUser);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const handleLogin = async (req: Request, res: Response) => {
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

const authenticateJWT = async (
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
      // console.log(decoded);
      req.id = decoded.id;
      next();
    });
  } else {
    res.status(401).json({ message: "Authorization token required" });
  }
};

const handleRefreshToken = async (req: Request, res: Response) => {
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
      expiresIn: "30s",
    });
    res.json({ accessToken });
  });
};
router.get("/refresh", handleRefreshToken);
  
const handleLogout = async (req: Request, res: Response) => {
  // On client, also delete the accessToken
  console.log("logout");

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await repo.getByRefreshToken(refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  await repo.update(foundUser.id, {
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    password: undefined,
    phoneNumber: undefined,
    refreshToken: refreshToken,
  } as unknown as IMemberBase);

  
  router.get("/logout", handleLogout);


  // router.put("/:id", authenticateJWT, async (req, res) => {
  //   try {
  //     const userId = parseInt(req.params.id, 10);
  //     if (userId !== req.user.userId) {
  //       return res
  //         .status(403)
  //         .json({ message: "You can only update your own details" });
  //     }
  //     const updatedData: IMemberBase = req.body;
  //     if (updatedData.password) {
  //       // Hash the password before updating
  //       updatedData.password = await bcrypt.hash(updatedData.password, 10);
  //     }
  //     const updatedUser = await repo.update(userId, updatedData);
  //     if (!updatedUser) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  //     res.json(updatedUser);
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // });

  router.delete("/:id", authenticateJWT, async (req: Request, res) => {
    console.log("delete");

    try {
      const userId = parseInt(req.params.id, 10);
      if (userId !== req.id) {
        return res
          .status(403)
          .json({ message: "You can only delete your own account" });
      }
      const deletedUser = await repo.delete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(deletedUser);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  router.get("/:id", authenticateJWT, async (req, res) => {
    console.log("get");

    try {
      const userId = Number(req.params.id);

      if (userId !== req.id) {
        return res
          .status(403)
          .json({ message: "You can only view your own details" });
      }
      const user = await repo.getById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // router.get("/", async (req, res) => {
  //   try {
  //     const { limit, offset, search } = req.query;
  //     const pageRequest = {
  //       limit: parseInt(limit as string, 10) || 10,
  //       offset: parseInt(offset as string, 10) || 0,
  //       search: (search as string) || "",
  //     };
  //     const usersList = await repo.list(pageRequest);
  //     res.json(usersList);
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // });

  res.clearCookie("jwt", { httpOnly: true });
  res.sendStatus(204);
};

router.post("/register", handleNewUser);
router.post("/login", handleLogin);
