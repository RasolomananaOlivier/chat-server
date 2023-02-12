import { Document, isValidObjectId, QueryOptions } from "mongoose";
import RequestModel from "../database/models/RequestModel";
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
  if (isValidObjectId(userId)) {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      throw new AppError({
        name: "UserNotFound",
        message: `User with id ${userId} not found`,
        status: 404,
      });
    }

    return foundUser;
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidUserId",
      message: `Failed to cast userId ${userId}`,
    });
  }
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

  if (isValidObjectId(userId)) {
    const userEmailUpdated = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        "email.address": email,
      },
      options
    );

    if (!userEmailUpdated) {
      throw new AppError({
        name: "UserNorFound",
        message: `User with id ${userId} not found`,
        status: 404,
      });
    }

    return userEmailUpdated;
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidUserId",
      message: "UserId must be in objectId type",
    });
  }
};

const addFriend = async (userId: string, newFriendId: string) => {
  if (isValidObjectId(userId) && isValidObjectId(newFriendId)) {
    const user = await UserModel.findById(userId);

    const isConnected = user?.friends?.some((id) => id === newFriendId);
    if (isConnected) {
      user?.friends?.push(newFriendId);

      return await user?.save();
    } else {
      console.log("Users already connected");
    }
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidUserId",
      message: "UserId or newFriendId must be in objectId type",
    });
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
  deleteAllUsers,
  addFriend,
};
