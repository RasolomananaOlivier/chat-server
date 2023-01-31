import bcrypt from "bcrypt";
import UserModel from "../database/models/UserModel";

interface ILogin {
  email: string;
  password: string;
}

export const login = async (arg: ILogin) => {
  const foundUser = await UserModel.findOne({ "email.address": arg.email });
  if (!foundUser) {
    throw new Error(`User with email ${arg.email} doesn't exist`);
  }

  const isCorrect = await bcrypt.compare(arg.password, foundUser.password);

  if (isCorrect) {
    return foundUser;
  } else {
    throw new Error("User password incorrect");
  }
};

const AuthServices = { login };

export default AuthServices;
