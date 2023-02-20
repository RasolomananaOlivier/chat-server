import { sign } from "jsonwebtoken";
// import * as dotenv from "dotenv";

// import "dotenv/config";

interface IPayload {
  userId: string;
  firstname: string;
  lastname: string;
}

// TODO : Configure dotenv to store the secret key
// dotenv.config({ path: __dirname + "../../.env" });

export const createToken = (payload: IPayload) => {
  const token = sign(JSON.stringify(payload), process.env.SECRET_KEY!);
  return token;
};
