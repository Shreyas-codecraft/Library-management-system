import express from 'express';
export const loginRouter = express.Router();
import { handleLogin } from "../controller/authController";

loginRouter.post('/', handleLogin);

