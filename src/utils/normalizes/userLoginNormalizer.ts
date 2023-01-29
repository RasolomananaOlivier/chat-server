import { Request } from "express";

export const userLoginNormalizer = (req: Request) => {
  return {
    email: req.body.email,
    password: req.body.password,
  };
};
