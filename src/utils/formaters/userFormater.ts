import { Request } from "express";
import { IUser, IUserUpdate } from "../../database/models/UserModel";

const beforeRegistration = (req: Request): IUser => {
  return {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: {
      address: req.body.email,
      verified: false,
    },
    password: req.body.password,
    friends: [],
  };
};

const beforeLogin = (req: Request) => {
  return {
    email: req.body.email,
    password: req.body.password,
  };
};

const beforeUpdate = (req: Request): IUserUpdate => {
  return {
    userId: req.params.userId,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };
};

const beforeEmailUpdate = (req: Request) => {
  return {
    userId: req.params.userId,
    email: req.body.email,
  };
};

const beforeHandlingRelation = (req: Request) => {
  return {
    userId: req.params.userId,
    friendId: req.body.friendId,
  };
};

export const UserFormater = {
  beforeRegistration,
  beforeLogin,
  beforeUpdate,
  beforeEmailUpdate,
  beforeHandlingRelation,
};