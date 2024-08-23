import express from "express";
import { authenticateJWT, handleDelete, handleGetById, handleLogin, handleLogout, handleNewUser, handleRefreshToken } from "./member.middlewares";
import cookieParser from "cookie-parser";
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
import { Request, Response, NextFunction } from 'express';

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.post("users/register", handleNewUser);
app.post("users/login", handleLogin);

app.get("users/:id", authenticateJWT,handleGetById );
app.delete("users/:id", authenticateJWT,handleDelete );

app.get("users/logout", handleLogout);

app.get("users/refresh", handleRefreshToken);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });