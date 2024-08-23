import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NextFunction, Request, Response, Router } from "express"; // Import types
import { BookRepository } from "../book-management/book.repository";
import { IBook } from "../book-management/models/books.model";
import { Appenv } from "../read-env";
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = Appenv.JWT_SECRET;
const REFRESH_SECRET = Appenv.REFRESH_SECRET;

const pool = mysql.createPool(
  "mysql://root:root_password@localhost:3306/librarydb"
);
const db = drizzle(pool);
const bookRepository = new BookRepository(db);

export const router = Router();

export const handleAddBook = async (request: Request, response: Response) => {
  const book = request.body;
  try {
    if (request.role !== "admin") {
      response
        .status(403)
        .json({ message: "Only admins add books" });
      return;
    }
    const createdBook = await bookRepository.create(book);
    if (createdBook) {
        response.status(200).json({ message: "User not found" });
    } else {
      response.writeHead(404, { "Content-Type": "plain/text" });
      response.end("Book not found");
    }
  } catch (err: any) {
    if (err.message.includes("Duplicate")) {
      response.writeHead(500, { "Content-Type": "plain/text" });
      response.end("Duplicate ISBNNo entered");
    }
    response.writeHead(500, { "Content-Type": "plain/text" });
    response.end("Internal server error");
  }
};

export const handleGetBookById = async (
  request: Request,
  response: Response
) => {
  
  const bookId = Number(request.params.id);
  try {
    const book = await bookRepository.getById(bookId);
    if (book) {
        response.status(200).json(book);
    } else {
      response.writeHead(404, { "Content-Type": "plain/text" });
      response.end("Book not found");
    }
  } catch (err) {
    response.writeHead(500, { "Content-Type": "plain/text" });
    response.end("Internal server error");
  }
};

export const listHandler = async (req: Request, res: Response) => {
    try {
      const { limit, offset, search } = req.query;
      console.log(req.query);
      const pageRequest = {
        limit: parseInt(limit as string, 10) || 100,
        offset: parseInt(offset as string, 10) || 0,
        search: (search as string) || "",
      };
      const usersList = await bookRepository.list(pageRequest);
      res.json(usersList);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

export const handleDeleteBook = async (request: Request, response: Response) => {
  
  const bookId = Number(request.params.id);
    console.log("======>")
  if (isNaN(bookId)) {
    response.writeHead(400, { "Content-Type": "plain/text" });
    response.end("Invalid book ID");
    return;
  }
  try {
    if (request.role !== "admin") {
        response
          .status(403)
          .json({ message: "Only admins delete books" });
        return;
      }
    const book = await bookRepository.getById(bookId);
    if (book) {
      await bookRepository.delete(bookId);
      response.end(
        JSON.stringify({
          message: `Book with ID ${bookId} deleted successfully`,
        })
      );
    } else {
      response.writeHead(404, { "Content-Type": "plain/text" });
      response.end("Book not found");
    }
  } catch (err) {
    response.writeHead(500, { "Content-Type": "plain/text" });
    response.end("Internal server error");
  }
};

export const handleUpdateBook = async (request: Request, response: Response) => {
  const baseUrl = `http://${request.headers.host}`;
  const url = new URL(request.url ?? "", baseUrl);
  const bookId = Number(url.searchParams.get("id"));

  if (isNaN(bookId)) {
    response.writeHead(400, { "Content-Type": "plain/text" });
    response.end("Invalid book ID");
    return;
  }
  const toBeUpdated = await request.body;
  try {
    if (request.role !== "admin") {
        response
          .status(403)
          .json({ message: "Only admins update books" });
        return;
      }
    console.log(toBeUpdated);
    const updatedBook = await bookRepository.update(bookId, toBeUpdated);
    if (updatedBook) {
      response.end(
        JSON.stringify({
          message: `Book with ID ${bookId} updated successfully`,
          book: updatedBook,
        })
      );
    } else {
      response.writeHead(404, { "Content-Type": "plain/text" });
      response.end("Book not found");
    }
  } catch (error) {
    response.writeHead(500, { "Content-Type": "plain/text" });
    response.end("Internal server error");
  }
};

const validateBookDataMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.method === "POST") {
    const body = await request.body;
    try {
      const isValidBook = (data: any): data is Omit<IBook, "id"> =>
        ["title", "author", "publisher", "genre", "isbnNo"].every(
          (key) => typeof data[key] === "string"
        ) &&
        ["numOfPages", "totalNumOfCopies", "availableNumOfCopies"].every(
          (key) => typeof data[key] === "number"
        );

      if (!isValidBook(body)) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Invalid book data format" }));
        return;
      }
    } catch (error) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid JSON body" }));
      return;
    }
  }
  if (next) next();
};
