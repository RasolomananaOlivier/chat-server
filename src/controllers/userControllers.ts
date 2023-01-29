import { Request, Response } from "express";
import UserModel, { IUser } from "../database/models/UserModel";
import { validationResult } from "express-validator";
import { userRegistrationNormalizer } from "../utils/normalizes/userRegistrationNormalizer";
import { createToken } from "../utils/createToken";
import { UserServices } from "../services/userServices";
import { AppError } from "../utils/appError";

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
      res.status(error.status).json({ status: 404, error: error.message });
    } else {
      res.status(500).json({ error: "Unexpected error" });
    }
  }
};

const createOneUser = async (req: Request, res: Response) => {
  try {
    const userSaved = await UserServices.register(
      userRegistrationNormalizer(req)
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
    if (error instanceof AppError)
      res.status(400).json({ status: 400, error: error.message });
  }
};

const updateOneUser = (req: Request, res: Response) => {
  res.json({ message: "getoneuser called" });
};

const deleteOneUser = (req: Request, res: Response) => {
  return;
};

const UserControllers = {
  getAllUsers,
  getOneUser,
  createOneUser,
  updateOneUser,
  deleteOneUser,
};

export default UserControllers;
