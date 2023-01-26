const express = require("express");
const AuthControllers = require("../../controllers/authControllers");
const UserControllers = require("../../controllers/userControllers");
const AuthRoutes = express.Router();

AuthRoutes.post("/login", AuthControllers.login);

module.exports = AuthRoutes;
