import { CustomRequest, HTTPServer, Middleware } from "./server"
import { BookRepository } from "./book-management/book.repository";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { resolve } from "path/posix";
import { IBook } from "./book-management/models/books.model";

const server = new HTTPServer(3000);
const pool = mysql.createPool(
  "mysql://root:root_password@localhost:3306/librarydb"
);

const db = drizzle(pool);
const bookRepository = new BookRepository(db);

const handleAddBook: Middleware = async (request, response) => {
  const book = await request.body;
  try {
    const createdBook = await bookRepository.create(book);
    if (createdBook) {
      response.end(JSON.stringify({ message: "Book added successfully" }));
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

const handleGetBookById: Middleware = async (request, response) => {
  const baseUrl = `http://${request.headers.host}`;
  const url = new URL(request.url ?? "", baseUrl);
  const bookId = Number(url.searchParams.get("id"));
  try {
    const book = await bookRepository.getById(bookId);
    if (book) {
      response.end(JSON.stringify(book));
    } else {
      response.writeHead(404, { "Content-Type": "plain/text" });
      response.end("Book not found");
    }
  } catch (err) {
    response.writeHead(500, { "Content-Type": "plain/text" });
    response.end("Internal server error");
  }
};

const handleListBooks: Middleware = async (request, response) => {
  const baseUrl = `http://${request.headers.host}`;
  const url = new URL(request.url ?? "", baseUrl);
  const page = Number(url.searchParams.get("page"));
  const search = url.searchParams.get("search") || undefined;
  const limit = Number(url.searchParams.get("limit"));
  const offset = (page - 1) * limit;
  try {
    const books = await bookRepository.list({
      search: search,
      limit: Number(limit),
      offset: Number(offset),
    });
    if (books) {
      response.end(JSON.stringify(books));
    } else {
      response.writeHead(404, { "Content-Type": "plain/text" });
      response.end("Books not found");
    }
  } catch (err) {
    response.writeHead(500, { "Content-Type": "plain/text" });
    response.end("Internal server error");
  }
};

const handleDeleteBook: Middleware = async (request, response) => {
  const baseUrl = `http://${request.headers.host}`;
  const url = new URL(request.url ?? "", baseUrl);
  const bookId = Number(url.searchParams.get("id"));

  if (isNaN(bookId)) {
    response.writeHead(400, { "Content-Type": "plain/text" });
    response.end("Invalid book ID");
    return;
  }
  try {
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

const handleUpdateBook: Middleware = async (request, response) => {
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

const validateBookDataMiddleware: Middleware = async (
  request,
  response,
  next
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

server.patch("/books", handleUpdateBook);

// server.delete("/books", handleDeleteBook);

server.get("/books", handleGetBookById);

server.get("/books", handleListBooks);

server.post("/books", validateBookDataMiddleware, handleAddBook);

server.use((request, response, next) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  if (next) next();
});

server.use(async (request: CustomRequest, response, next) => {
  if (request.method === "POST" || request.method === "PATCH") {
    request.body = new Promise((resolve, reject) => {
      let bodyData = "";
      request.on("data", (chunk) => {
        bodyData += chunk.toString();
      });

      request.on("end", async () => {
        try {
          let json = JSON.parse(bodyData);
          resolve(json);
          if (next) next();
        } catch (error) {
          response.writeHead(400, { "Content-Type": "application/json" });
          reject(new Error("No data found"));
        }
      });
    });
  } else {
    if (next) next();
}
});
const express = require('express');
const router = express.Router();
