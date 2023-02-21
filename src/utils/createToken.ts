import { sign } from "jsonwebtoken";
export interface IPayload {
  userId: string;
  firstname: string;
  lastname: string;
}

export const createToken = (payload: IPayload) => {
  const token = sign(JSON.stringify(payload), process.env.SECRET_KEY!);
  return token;
};
