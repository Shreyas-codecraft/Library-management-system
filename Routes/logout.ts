const express = require('express');
export const logoutRouter = express.Router();
// const authController = require('../controllers/authController');
import { handleLogout } from "../controller/logoutController";
logoutRouter.post('/', handleLogout);

