import { Request, Response } from "express";
import AuthServices from "../services/authServices";
import { AppError } from "../utils/appError";
import { createToken } from "../utils/createToken";
import { UserFormater } from "../utils/formaters/userFormater";

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

export const AuthControllers = { login };
