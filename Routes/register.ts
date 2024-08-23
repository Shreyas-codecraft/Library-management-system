import express from 'express';
export const registerRouter = express.Router();
import { handleNewUser } from "../controller/registerController";
registerRouter.post('/', handleNewUser);



