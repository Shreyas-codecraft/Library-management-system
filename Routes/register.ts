const express = require('express');
export const registerRouter = express.Router();
// const authController = require('../controllers/authController');
import { handleNewUser } from "../controller/registerController";
registerRouter.post('/', handleNewUser);

