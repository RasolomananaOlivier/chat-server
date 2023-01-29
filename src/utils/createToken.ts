import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

interface IPayload {
  userId: string;
  firstname: string;
  lastname: string;
}

// TODO : Configure dotenv to store the secret key
dotenv.config();

const SECRET_KEY = "a";

export const createToken = (payload: IPayload) => {
  const token = sign(JSON.stringify(payload), process.env.SECRET_KEY);
  return token;
};
