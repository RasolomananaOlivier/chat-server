import { Response } from "express";

interface IError {
  name: string;
  message: string;
  status: number;
}

export class AppError extends Error {
  status: number;
  constructor({ name, message, status }: IError) {
    super(message);
    this.name = name;
    this.status = status;
  }

  response(res: Response) {
    return res.status(this.status).json({
      error: {
        status: this.status,
        name: this.name,
        error: this.message,
      },
    });
  }
}
