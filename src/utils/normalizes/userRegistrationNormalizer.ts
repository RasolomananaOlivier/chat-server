import { Request } from "express";
import { IUser } from "../../database/models/UserModel";

export const userRegistrationNormalizer = (req: Request): IUser => {
  return {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };
};
