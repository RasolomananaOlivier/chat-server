import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"].toString().split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY!, (err, payload) => {
      if (err) {
        res.status(400).json({
          status: 401,
          name: err.name,
          message: err.message,
        });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({
      name: "x-access-token-error",
      message: "x-access-token must be provided",
    });
  }
};
