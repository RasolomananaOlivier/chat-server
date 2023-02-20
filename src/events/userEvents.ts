import { Document } from "mongoose";
import { Server } from "socket.io";
import { IUser } from "../database/models/UserModel";
import Utilities from "../utils";

const update = (io: Server, user: IUser & Document<any, any, IUser>) => {
  io.to(Utilities.stringify(user._id)).emit("user:update", user);
};

const UserEvents = {
  handle: {},
  emit: { update },
};

export default UserEvents;
