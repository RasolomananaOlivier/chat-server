import express, { Request, Response } from "express";
import UserControllers from "../../controllers/userControllers";
import {
  userRegistrationRules,
  validateRegistration,
} from "../../middlewares/validateRegistration";
import { authenticate } from "../../middlewares/authenticate";

const UserRoutes = express.Router();

UserRoutes.get("/", UserControllers.getAllUsers);

UserRoutes.get(
  "/:userId",
  authenticate,
  async (req: Request, res: Response) => {
    switch (req.query.q) {
      case "friends":
        // /v1/api/users/:userId?q=friends
        await UserControllers.getUserFriends(req, res);
        break;
      case "suggestions":
        // /v1/api/users/:userId?q=suggestions
        await UserControllers.getSuggestions(req, res);
        break;
      default:
        await UserControllers.getOneUser(req, res);
        break;
    }
  }
);

UserRoutes.post(
  "/",
  userRegistrationRules(),
  validateRegistration,
  UserControllers.createOneUser
);

UserRoutes.put(
  "/:userId",
  authenticate,
  async (req: Request, res: Response) => {
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
  }
);

UserRoutes.put(
  "/:userId/password",
  authenticate,
  UserControllers.updatePassword
);

UserRoutes.delete("/", UserControllers.deleteUsers);

UserRoutes.delete("/:userId", UserControllers.deleteOneUser);

export default UserRoutes;
