import express from 'express';
export const logoutRouter = express.Router();
import { handleLogout } from "../controller/logoutController";
logoutRouter.post('/', handleLogout);

