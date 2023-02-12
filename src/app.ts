import express from "express";
import dbConnection from "./database/connect";
import AuthRoutes from "./v1/routes/authRoutes";
import MessageRoutes from "./v1/routes/messageRoutes";
import UserRoutes from "./v1/routes/userRoutes";

import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import RequestEvents from "./events/requestEvent";
import joinPrivateRoom from "./middlewares/socket/joinPrivateRoom";
import joinMessageRoom from "./middlewares/socket/joinMessageRoom";
import MessageEvents from "./events/messageEvents";
import cors from "cors";
import RequestRoutes from "./v1/routes/requestRoutes";

const app = express();

dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/messages", MessageRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/requests", RequestRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer);

io.use(joinPrivateRoom);
io.use(joinMessageRoom);

io.on("connection", (socket) => {
  socket.onAny((...arg) => {
    console.log(arg);
  });
  // Request Phase
  RequestEvents.handle.creation(io, socket);
  RequestEvents.handle.accept(io, socket);
  RequestEvents.handle.refuse(io, socket);

  // Message Phase
  MessageEvents.handle.push(io, socket);
});

export default httpServer;
