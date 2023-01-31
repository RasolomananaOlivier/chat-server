import { Document, QueryOptions } from "mongoose";
import UserModel, { IUser, IUserUpdate } from "../database/models/UserModel";
import { AppError } from "../utils/appError";

const register = async (userData: IUser) => {
  const foundUser = await UserModel.findOne({
    "email.address": userData.email.address,
  });

  if (foundUser !== null) {
    throw new AppError({
      name: "Registration error",
      message: "User with the same email already exist",
      status: 404,
    });
  }

  const user = new UserModel(userData);
  return await user.save();
};

const findUserById = async (userId: string) => {
  const foundUser = await UserModel.findById(userId);

  if (!foundUser) {
    throw new AppError({
      name: "find one user by id",
      message: `User with id ${userId} not found`,
      status: 404,
    });
  }

  return foundUser;
};

const updatePersonalInformation = async (update: IUserUpdate) => {
  const options: QueryOptions = { useFindAndModify: false, new: true };

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: update.userId },
    {
      firstname: update.firstname,
      lastname: update.lastname,
    },
    options
  );

  if (!updatedUser) {
    throw new AppError({
      name: "update user personnal information",
      message: `User with id ${update.userId} not found`,
      status: 404,
    });
  }

  return updatedUser;
};

const updateEmail = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const options: QueryOptions = { useFindAndModify: false, new: true };

  const userEmailUpdated = await UserModel.findOneAndUpdate(
    { _id: userId },
    {
      "email.address": email,
    },
    options
  );

  if (!userEmailUpdated) {
    throw new AppError({
      name: "update user email",
      message: `User with id ${userId} not found`,
      status: 404,
    });
  }

  return userEmailUpdated;
};

interface IFriendParams {
  userId: string;
  friendId: string;
  type: "add" | "remove";
}
const relation = async ({ userId, friendId, type }: IFriendParams) => {
  const user = await UserModel.findById(userId);
  const friend = await UserModel.findById(friendId);

  if (!user || !friend) {
    throw new AppError({
      name: "Add new friend error",
      message: `User ${userId} or ${friendId} does not exist`,
      status: 404,
    });
  }

  // Check if the two users are already connected
  const isConnected =
    user.friends?.some((id) => id === friendId) ||
    friend.friends?.some((id) => id === userId);

  if (type === "add") {
    if (isConnected) {
      throw new AppError({
        name: "Add new friend error",
        message: `User ${userId} and ${friendId} are already connected`,
        status: 400,
      });
    }
    user.friends?.push(friendId);
    friend.friends?.push(userId);

    return { user: await user.save(), friend: await friend.save() };
  } else {
    if (!isConnected) {
      throw new AppError({
        name: "Remove friend error",
        message: `User ${userId} and ${friendId} are already disconnected`,
        status: 400,
      });
    }
    user.friends = user.friends?.filter((id) => id !== friendId);
    friend.friends = friend.friends?.filter((id) => id !== userId);

    return { user: await user.save(), friend: await friend.save() };
  }
};

const deleteAllUsers = async () => {
  await UserModel.deleteMany({});
};
export const UserServices = {
  register,
  findUserById,
  updatePersonalInformation,
  updateEmail,
  relation,
  deleteAllUsers,
};
