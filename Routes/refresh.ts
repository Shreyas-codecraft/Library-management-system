const express = require('express');
export const refreshRouter = express.Router();
// const authController = require('../controllers/authController');
import { handleRefreshToken } from "../controller/refreshController";
refreshRouter.get('/', handleRefreshToken);

