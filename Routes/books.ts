import { handleGetBookById ,handleAddBook, listHandler, handleUpdateBook, handleDeleteBook,} from "../controller/bookController";
import express from "express";

export const bookRouter = express.Router();

bookRouter.get("/:id", handleGetBookById);
bookRouter.post("/:id", handleAddBook);
bookRouter.get("/", listHandler);
bookRouter.patch("/:id", handleUpdateBook);
bookRouter.delete("/:id", handleDeleteBook);

