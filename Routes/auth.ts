const express = require('express');
export const loginRouter = express.Router();
// const authController = require('../controllers/authController');
import { handleLogin } from "../controller/authController";

loginRouter.post('/', handleLogin);

