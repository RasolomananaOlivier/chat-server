import { Request, Response } from "express";
import UserModel, { IUser } from "../database/models/UserModel";
import { createToken } from "../utils/createToken";
import { UserServices } from "../services/userServices";
import { AppError } from "../utils/appError";
import { UserFormater } from "../utils/formaters/userFormater";

const getAllUsers = async (req: Request, res: Response) => {
  res.status(200).send({ data: await UserModel.find() });
};

const getOneUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await UserServices.findUserById(userId);

    res.json(user);
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
    }
  }
};

const getUserFriends = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await UserServices.findUserById(userId);

    let friends: IUser[] = [];
    if (user.friends) {
      for (const friendId of user.friends) {
        const friend = await UserServices.findUserById(friendId);
        friends.push(friend);
      }
    }

    res.json(friends);
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
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

    res.status(201).json({
      data: userSaved,
      token: `bearer ${token}`,
    });
  } catch (error) {
    // console.log(error);

    if (error instanceof AppError)
      res.status(400).json({ status: 400, error: error.message });
  }
};

const updateInformation = async (req: Request, res: Response) => {
  try {
    const updatedUser = await UserServices.updatePersonalInformation(
      UserFormater.beforeUpdate(req)
    );

    res.json({ status: 200, data: updatedUser });
  } catch (error) {
    if (error instanceof AppError) error.response(res);
  }
};

const updateEmail = async (req: Request, res: Response) => {
  try {
    // TODO: Validate email before processing

    const userEmailUpdated = await UserServices.updateEmail(
      UserFormater.beforeEmailUpdate(req)
    );

    res.json({ status: 200, data: userEmailUpdated });
  } catch (error) {
    if (error instanceof AppError) error.response(res);
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
  getUserFriends,
  createOneUser,
  deleteOneUser,
  deleteUsers,
  updateInformation,
  updateEmail,
};

export default UserControllers;
