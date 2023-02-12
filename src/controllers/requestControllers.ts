import { Request, Response } from "express";
import { log } from "node:console";
import RequestModel from "../database/models/RequestModel";
import RequestServices from "../services/RequestServices";
import { AppError } from "../utils/appError";

const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find({});
    res.json(requests);
  } catch (error) {
    if (error instanceof AppError) error.response(res);
  }
};

const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestServices.findAllByDestinationId(
      req.params.userId
    );

    res.json(requests);
  } catch (error) {
    if (error instanceof AppError) error.response(res);
  }
};

const RequestController = { getAllRequests, getRequests };

export default RequestController;
