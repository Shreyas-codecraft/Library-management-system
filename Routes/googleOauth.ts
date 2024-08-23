import express from 'express';
import { redirectToGoogle } from '../controller/redirectToGoogle';
export const googleRouter = express.Router();
// import { handleNewUser } from "../controller/registerController";
googleRouter.get('/', redirectToGoogle);




