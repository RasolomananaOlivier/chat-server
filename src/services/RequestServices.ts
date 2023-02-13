import { isValidObjectId } from "mongoose";
import RequestModel, { IRequestClient } from "../database/models/RequestModel";
import UserModel from "../database/models/UserModel";
import { AppError } from "../utils/appError";
import { UserServices } from "./userServices";

interface IAcceptParams {
  destinationId: string;
  originId: string;
  requestId: string;
}

interface ICreateRequestParams {
  destinationId: string;
  originId: string;
}
const create = async ({ destinationId, originId }: ICreateRequestParams) => {
  const destination = await UserModel.findById(destinationId);
  const origin = await UserModel.findById(originId);

  if (!destination || !origin) {
    throw new AppError({
      name: "Add new friend error",
      message: `User ${destinationId} or ${originId} does not exist`,
      status: 404,
    });
  }

  const existingRequest = await RequestModel.findOne({
    destinationId,
    originId,
  });

  if (existingRequest === null) {
    const request = new RequestModel({
      destinationId,
      originId,
      message: `${origin.firstname} ${origin.lastname} want to connect with you`,
    });

    const savedRequest = await request.save();

    return savedRequest;
  } else {
    console.log("Request already exists");
  }
};

const findAllByDestinationId = async (userId: string) => {
  if (isValidObjectId(userId)) {
    const result = await RequestModel.find({ destinationId: userId });

    let requestsList: IRequestClient[] = [];

    for (const request of result) {
      const origin = await UserServices.findUserById(request.originId);
      requestsList.push({
        _id: request._id,
        userId: origin._id,
        email: origin.email.address,
        fullname: origin.getFullname(),
      });
    }
    return requestsList;
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidUserId",
      message: "UserId provided is not a valid",
    });
  }
};

const findAllByOriginId = async (userId: string) => {
  if (isValidObjectId(userId)) {
    const result = await RequestModel.find({ originId: userId });

    return result;
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidUserId",
      message: "UserId provided is not a valid",
    });
  }
};

const findOne = async (requestId: string) => {
  if (isValidObjectId(requestId)) {
    const request = await RequestModel.findById(requestId);

    return request;
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidRequestId",
      message: "RequestId provided is not a valid",
    });
  }
};

const deleteOne = async (requestId: string) => {
  if (isValidObjectId(requestId)) {
    await RequestModel.deleteOne({ _id: requestId });
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidRequestId",
      message: "RequestId provided is not a valid",
    });
  }
};

const isRequestExist = async (userId: string, testId: string) => {
  const byDestination = await RequestModel.findOne({
    destinationId: userId,
    originId: testId,
  });
  const byOrigin = await RequestModel.findOne({
    destinationId: testId,
    originId: userId,
  });

  if (byDestination === null && byOrigin === null) {
    return false;
  } else {
    return true;
  }
};

const RequestServices = {
  create,
  findAllByDestinationId,
  findAllByOriginId,
  findOne,
  deleteOne,
  isRequestExist,
};

export default RequestServices;
