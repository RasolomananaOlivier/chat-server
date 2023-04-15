import { Document, isValidObjectId, QueryOptions } from "mongoose";
import RequestModel from "../database/models/RequestModel";
import UserModel, { IUser, IUserUpdate } from "../database/models/UserModel";
import { AppError } from "../utils/appError";
import bcrypt from "bcrypt";
import RequestServices from "./RequestServices";

const isEmailExist = async (email: string) => {
  const foundUser = await UserModel.findOne({
    "email.address": email,
  });

  if (foundUser !== null) {
    throw new AppError({
      name: "RegistrationError",
      message: "User with the same email already exist",
      status: 400,
    });
  }
};
const register = async (userData: IUser) => {
  const foundUser = await UserModel.findOne({
    "email.address": userData.email.address,
  });

  if (foundUser !== null) {
    throw new AppError({
      name: "Registration error",
      message: "User with the same email already exist",
      status: 400,
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
    { _id: update._id },
    {
      firstname: update.firstname,
      lastname: update.lastname,
      avatarUrl: update.avatarUrl,
      "email.address": update.email,
      birthday: update.birthday,
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

    const connected = user?.friends?.some((id) => id === newFriendId);

    if (!connected) {
      user?.friends?.push(newFriendId);

      return await user?.save();
    } else {
      // TODO: send an error to inform that the users are connected
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

const getSuggestions = async (userId: string) => {
  if (isValidObjectId(userId)) {
    // Find all users except the one having userId as _id
    const users = await UserModel.find().where("_id").ne(userId);

    const filterUsers = users.filter((user) => {
      const userFriends = user.friends;
      if (userFriends) {
        // Check if user has friends
        if (userFriends.length > 0) {
          // Check if user friends doesn't include user userId
          if (userFriends.some((id) => id !== userId)) {
            // Then the user is not friends with userId
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    });

    const arrayPromise = filterUsers.map((user) =>
      RequestServices.isRequestExist(userId, user._id)
    );
    const isRequestsCreated = await Promise.all(arrayPromise);
    const suggestions = filterUsers.filter(
      (user, index) => !isRequestsCreated[index]
    );

    return suggestions;
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidUserId",
      message: "UserId must be in objectId type",
    });
  }
};

const updatePassword = async (
  userId: string,
  oldpassword: string,
  newpassword: string
) => {
  if (isValidObjectId(userId)) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError({
        status: 404,
        name: "UserNotFound",
        message: `User with password ${oldpassword} and id ${userId} cannot be found`,
      });
    }

    const isCorrect = await bcrypt.compare(oldpassword, user.password);

    if (!isCorrect) {
      throw new AppError({
        status: 422,
        name: "WrongOldPassword",
        message: `The old password you have provide is wrong`,
      });
    } else {
      user.password = newpassword;
      await user.save();
    }
  } else {
    throw new AppError({
      status: 422,
      name: "InvalidUserId",
      message: "UserId must be in objectId type",
    });
  }
};

export const UserServices = {
  isEmailExist,
  register,
  findUserById,
  updatePersonalInformation,
  updateEmail,
  deleteAllUsers,
  addFriend,
  getSuggestions,
  updatePassword,
};
