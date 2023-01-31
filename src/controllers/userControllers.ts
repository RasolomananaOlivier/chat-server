import { Request, Response } from "express";
import UserModel, { IUser } from "../database/models/UserModel";
import { createToken } from "../utils/createToken";
import { UserServices } from "../services/userServices";
import { AppError } from "../utils/appError";
import { UserFormater } from "../utils/formaters/userFormater";
import { body, validationResult } from "express-validator";

const getAllUsers = async (req: Request, res: Response) => {
  res.send({ data: await UserModel.find() });
};

const getOneUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await UserServices.findUserById(userId);

    res.json({ data: user });
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
    } else {
      res.status(500).json({ message: "Unexpected error", error });
    }
  }
};

const createOneUser = async (req: Request, res: Response) => {
  try {
    const userSaved = await UserServices.register(
      UserFormater.beforeRegistration(req)
    );
    const token = createToken({
      userId: userSaved._id,
      firstname: userSaved.firstname,
      lastname: userSaved.lastname,
    });

    res.json({
      data: userSaved,
      token: `bearer ${token}`,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof AppError)
      res.status(400).json({ status: 400, error: error.message });
  }
};

const updateOneUser = async (req: Request, res: Response) => {
  // Check if there is a query
  if (Object.keys(req.query).length === 0) {
    // Update personnal information
    try {
      const updatedUser = await UserServices.updatePersonalInformation(
        UserFormater.beforeUpdate(req)
      );

      res.json({ status: 200, data: updatedUser });
    } catch (error) {
      if (error instanceof AppError) error.response(res);
    }
  } else {
    // Updating user email
    if (req.query.email === "update") {
      try {
        // TODO: Validate email before processing

        const userEmailUpdated = await UserServices.updateEmail(
          UserFormater.beforeEmailUpdate(req)
        );

        res.json({ status: 200, data: userEmailUpdated });
      } catch (error) {
        console.log(error);
        if (error instanceof AppError) error.response(res);
      }
      // Validating email
    } else if (req.query.email === "validate") {
      // TODO: Validate the email provided by the user
      // Adding new friend
    } else if (req.query.friend === "add" || req.query.friend === "remove") {
      // TODO: Validate if the friendId in body exists
      try {
        const { user, friend } = await UserServices.relation({
          ...UserFormater.beforeHandlingRelation(req),
          type: req.query.friend,
        });

        res.json({ status: 200, data: { user, friend } });
      } catch (error) {
        console.log(error);

        if (error instanceof AppError) {
          error.response(res);
        }
      }
    }
  }
};

const deleteOneUser = async (req: Request, res: Response) => {};

const deleteUsers = async (req: Request, res: Response) => {
  try {
    await UserServices.deleteAllUsers();
    res.json({ status: 200, message: "All users deleted" });
  } catch (error) {
    console.log(error);
  }
};

const UserControllers = {
  getAllUsers,
  getOneUser,
  createOneUser,
  updateOneUser,
  deleteOneUser,
  deleteUsers,
};

export default UserControllers;
