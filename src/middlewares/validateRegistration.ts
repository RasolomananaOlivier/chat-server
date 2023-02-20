import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const userRegistrationRules = () => {
  return [
    body("firstname").isString().notEmpty(),
    body("lastname").isString().notEmpty(),
    body("email").isEmail(),
    body("password").isString(),
  ];
};

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};
