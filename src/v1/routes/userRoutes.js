const express = require("express");
const UserControllers = require("../../controllers/userControllers");
const UserRoutes = express.Router();

UserRoutes.get("/", UserControllers.getAllUsers);

UserRoutes.get("/:userId", UserControllers.getOneUser);

UserRoutes.post("/", UserControllers.createOneUser);

UserRoutes.put("/:userId", UserControllers.updateOneUser);

UserRoutes.delete("/:userId", UserControllers.deleteOneUser);

module.exports = UserRoutes;
