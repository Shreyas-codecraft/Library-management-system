import express from 'express';
import { googleAuthorize } from '../controller/googleAuthController';
export const AuthorizeRouter = express.Router();
AuthorizeRouter.get('/',googleAuthorize );




