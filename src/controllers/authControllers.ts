import { Request, Response } from "express";
import AuthServices from "../services/authServices";
import { AppError } from "../utils/appError";
import { createToken, IPayload } from "../utils/createToken";
import { UserFormater } from "../utils/formaters/userFormater";
import jwt from "jsonwebtoken";
import { UserServices } from "../services/userServices";

const login = async (req: Request, res: Response) => {
  try {
    const user = await AuthServices.login(UserFormater.beforeLogin(req));

    const token = createToken({
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    res.json({
      data: user,
      token: `bearer ${token}`,
    });
  } catch (error) {
    if (error instanceof AppError) error.response(res);
  }
};

const authenticate = (req: Request, res: Response) => {
  if (req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"].toString().split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY!, async (err, jwtPayload) => {
      if (err) {
        res.status(400).json({
          status: 401,
          name: err.name,
          message: err.message,
        });
      } else {
        const payload = jwtPayload as IPayload;

        try {
          const user = await UserServices.findUserById(payload.userId);
          res.json(user);
        } catch (error) {
          if (error instanceof AppError) error.response(res);
        }
      }
    });
  } else {
    res.status(400).json({
      name: "x-access-token-error",
      message: "x-access-token must be provided",
    });
  }
};

export const AuthControllers = { login, authenticate };
