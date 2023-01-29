import UserModel, { IUser } from "../database/models/UserModel";

const register = async (userData: IUser) => {
  const foundUser = await UserModel.findOne({ email: userData.email });

  if (foundUser) {
    throw new Error("User with the same email already exist");
  }

  const user = new UserModel(userData);
  return await user.save();
};

export const UserServices = { register };
