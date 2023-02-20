import { model, Schema } from "mongoose";

export interface IRequest {
  destinationId: string;
  originId: string;
  message: string;
}

export interface IRequestClient {
  _id: string;
  userId: string;
  fullname: string;
  email: string;
}

const RequestSchema = new Schema<IRequest>({
  destinationId: { type: String, require: true },
  originId: { type: String, require: true },
  message: { type: String, require: true },
});

const RequestModel = model<IRequest>("Request", RequestSchema);

export default RequestModel;
