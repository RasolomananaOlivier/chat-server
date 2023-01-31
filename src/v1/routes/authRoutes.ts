import express from "express";
import { AuthControllers } from "../../controllers/authControllers";
import {
  userLoginRoules,
  validateLogin,
} from "../../middlewares/validateLogin";
const AuthRoutes = express.Router();

AuthRoutes.post(
  "/login",
  userLoginRoules(),
  validateLogin,
  AuthControllers.login
);

module.exports = AuthRoutes;