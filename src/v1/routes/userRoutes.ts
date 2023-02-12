import express, { Request, Response } from "express";
import UserControllers from "../../controllers/userControllers";
import {
  userRegistrationRules,
  validateRegistration,
} from "../../middlewares/validateRegistration";
import { body } from "express-validator";
import { authenticate } from "../../middlewares/authenticate";
import { request } from "node:http";

const UserRoutes = express.Router();

UserRoutes.get("/", UserControllers.getAllUsers);

UserRoutes.get(
  "/:userId",
  authenticate,
  async (req: Request, res: Response) => {
    // /v1/api/users/:userId?q=friends
    if (req.query.q === "friends") {
      await UserControllers.getUserFriends(req, res);
    } else {
      await UserControllers.getOneUser(req, res);
    }
  }
);

UserRoutes.post(
  "/",
  userRegistrationRules(),
  validateRegistration,
  UserControllers.createOneUser
);

UserRoutes.put("/:userId", async (req: Request, res: Response) => {
  if (Object.keys(req.query).length === 0) {
    // No queries => Update user info
    await UserControllers.updateInformation(req, res);
  } else {
    if (req.query.email) {
      switch (req.query.email) {
        case "update":
          UserControllers.updateEmail(req, res);
          break;
        case "validate":
          // validate email
          break;
        default:
          break;
      }
    } else if (req.query.friend) {
      switch (req.query.friend) {
        case "add":
          // add friend
          // UserControllers.addFriend(req, res);
          break;
        case "remove":
          // remove friend
          break;
        default:
          break;
      }
    }
  }
});

UserRoutes.delete("/", UserControllers.deleteUsers);

UserRoutes.delete("/:userId", UserControllers.deleteOneUser);

export default UserRoutes;
