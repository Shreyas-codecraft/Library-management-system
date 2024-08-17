import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { Request, Response, Router } from "express"; // Import types
import { MemberRepository } from "../member-management/member.repository";
import { IMemberBase } from "../member-management/models/member.model";

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

export const handleDelete = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (req.role !== "admin") {
      res.status(403).json({ message: "only admin can delete books" });
      return;
    }
    await repo.delete(userId);
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const handleGetById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const user = await repo.getById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const handleUpdate = async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  try {
    const userId = Number(req.params.id);
    if (req.role !== "admin") {
      res.status(403).json({ message: "You can only update your own details" });
      return;
    }
    const data: IMemberBase = {
      ...({
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        password: undefined,
        phoneNumber: undefined,
        refreshToken: undefined,
      } as unknown as IMemberBase),
      ...body,
    };
    const user = await repo.update(userId, data);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const listHandler = async (req: Request, res: Response) => {
  try {
    if (req.role !== "admin") {
      res.status(403).json({ message: "Only admins can see member details" });
      return;
    }
    const { limit, offset, search } = req.query;
    console.log(req.query);
    const pageRequest = {
      limit: parseInt(limit as string, 10) || 10,
      offset: parseInt(offset as string, 10) || 0,
      search: (search as string) || "",
    };
    const usersList = await repo.list(pageRequest);
    res.json(usersList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
