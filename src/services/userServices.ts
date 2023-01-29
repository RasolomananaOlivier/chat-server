import UserModel, { IUser } from "../database/models/UserModel";
import { AppError } from "../utils/appError";

const register = async (userData: IUser) => {
  const foundUser = await UserModel.findOne({ email: userData.email });

  if (!foundUser) {
    throw new Error("User with the same email already exist");
  }

  const user = new UserModel(userData);
  return await user.save();
};

const findUserById = async (userId: string) => {
  const foundUser = await UserModel.findById(userId);

  if (!foundUser) {
    throw new AppError({
      name: "user services",
      message: `User with id ${userId} not found`,
      status: 404,
    });
  }

  return foundUser;
};

export const UserServices = { register, findUserById };
