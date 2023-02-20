import { Server, Socket } from "socket.io";
import MessageServices from "../services/messageServices";
import RequestServices from "../services/RequestServices";
import { UserServices } from "../services/userServices";
import Utilities from "../utils";
import NotificationEvents from "./NotificationEvents";
import UserEvents from "./userEvents";

const creation = (io: Server, socket: Socket) => {
  socket.on("request:new", async ({ destinationId, originId }) => {
    await RequestServices.create({
      destinationId,
      originId,
    });

    // To update suggestions list
    // For originId
    socket.emit("request:sent", await UserServices.getSuggestions(originId));

    // Send the new list of requests of the destinationId
    io.to(destinationId).emit(
      "request:listen",
      await RequestServices.findAllByDestinationId(destinationId)
    );
  });
};

const accept = (io: Server, socket: Socket) => {
  socket.on("request:accept", async (requestId) => {
    const request = await RequestServices.findOne(requestId);

    let destinationUpdated, originUpdated;
    // Check if the request is not null
    if (request) {
      // Check if the request destinationId & originId are defined
      if (request.destinationId && request.originId) {
        destinationUpdated = await UserServices.addFriend(
          request?.destinationId,
          request?.originId
        );
        originUpdated = await UserServices.addFriend(
          request?.originId,
          request?.destinationId
        );
      }
    }

    if (destinationUpdated && originUpdated) {
      // Send the updated account to their respective destination
      UserEvents.emit.update(io, destinationUpdated);
      UserEvents.emit.update(io, originUpdated);

      // Notify the origin of the request
      NotificationEvents.emit.push(
        io,
        Utilities.stringify(originUpdated._id),
        Utilities.stringify(destinationUpdated._id)
      );

      await MessageServices.createOne([
        destinationUpdated._id,
        originUpdated._id,
      ]);

      await RequestServices.deleteOne(requestId);
    }
  });
};

const refuse = (io: Server, socket: Socket) => {
  socket.on("request:refuse", async (requestId) => {
    const request = await RequestServices.findOne(requestId);

    if (request !== null) {
      const destinationId = request.destinationId;
      const originId = request.originId;

      await RequestServices.deleteOne(requestId);

      // Send the new list of requests of the destinationId
      io.to(destinationId).emit(
        "request:listen",
        await RequestServices.findAllByDestinationId(destinationId)
      );

      io.to(originId).emit(
        "request:listen",
        await RequestServices.findAllByOriginId(originId)
      );
    }
  });
};

const RequestEvents = {
  handle: { creation, accept, refuse },
};

export default RequestEvents;
