import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"].toString().split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        res.status(400).json({
          error: err,
        });
      }

      next();
    });
  } else {
    const err = new Error("x-access-token not found");
    //
    next(err.message);
  }
};
