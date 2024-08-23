import {
  handleDelete,
  handleGetById,
  handleUpdate,
  listHandler,
} from "../controller/memberController";
import express from "express";
handleUpdate;
export const memberRouter = express.Router();

memberRouter.get("/:id", handleGetById);
memberRouter.delete("/:id", handleDelete);
memberRouter.patch("/:id", handleUpdate);
memberRouter.get("/", listHandler);
