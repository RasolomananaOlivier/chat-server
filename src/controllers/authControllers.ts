import { Request, Response } from "express";
import AuthServices from "../services/authServices";
import { createToken } from "../utils/createToken";
const {
  userLoginNormalizer,
} = require("../utils/normalizes/userLoginNormalizer");

const login = async (req: Request, res: Response) => {
  try {
    const user = await AuthServices.login(userLoginNormalizer(req));

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
    res.status(400).json({
      status: 400,
      error: error.message,
    });
  }
};

const AuthControllers = { login };

module.exports = AuthControllers;
