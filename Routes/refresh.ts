import express from 'express';
export const refreshRouter = express.Router();
import { handleRefreshToken } from "../controller/refreshController";
refreshRouter.get('/', handleRefreshToken);

