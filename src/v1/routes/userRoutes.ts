import express from "express";
import UserControllers from "../../controllers/userControllers";
import {
  userRegistrationRules,
  validateRegistration,
} from "../../middlewares/validateRegistration";
import { body } from "express-validator";
import { authenticate } from "../../middlewares/authenticate";

const UserRoutes = express.Router();

UserRoutes.get("/", UserControllers.getAllUsers);

UserRoutes.get("/:userId", authenticate, UserControllers.getOneUser);

UserRoutes.post(
  "/",
  userRegistrationRules(),
  validateRegistration,
  UserControllers.createOneUser
);

UserRoutes.put("/:userId", UserControllers.updateOneUser);

UserRoutes.delete("/", UserControllers.deleteUsers);

UserRoutes.delete("/:userId", UserControllers.deleteOneUser);

export default UserRoutes;
