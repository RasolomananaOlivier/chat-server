import bcrypt from "bcrypt";
import UserModel from "../database/models/UserModel";
import { AppError } from "../utils/appError";

interface ILogin {
  email: string;
  password: string;
}

export const login = async (arg: ILogin) => {
  const foundUser = await UserModel.findOne({ "email.address": arg.email });
  if (!foundUser) {
    throw new AppError({
      status: 404,
      name: "EmailNotFound",
      message: `User with email ${arg.email} does not exist`,
    });
  }

  const isCorrect = await bcrypt.compare(arg.password, foundUser.password);

  if (isCorrect) {
    return foundUser;
  } else {
    throw new AppError({
      status: 400,
      name: "IncorrectPassword",
      message: `Incorrect Password provided`,
    });
  }
};

const AuthServices = { login };

export default AuthServices;
