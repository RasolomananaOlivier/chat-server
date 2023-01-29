const express = require("express");
const AuthControllers = require("../../controllers/authControllers");
const UserControllers = require("../../controllers/userControllers");
const {
  userLoginRoules,
  validateLogin,
} = require("../../middlewares/validateLogin");
const AuthRoutes = express.Router();

AuthRoutes.post(
  "/login",
  userLoginRoules(),
  validateLogin,
  AuthControllers.login
);

module.exports = AuthRoutes;
