"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_1 = __importDefault(require("./database/connect"));
const authRoutes_1 = __importDefault(require("./v1/routes/authRoutes"));
const messageRoutes_1 = __importDefault(require("./v1/routes/messageRoutes"));
const userRoutes_1 = __importDefault(require("./v1/routes/userRoutes"));
require("dotenv/config");
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const requestEvent_1 = __importDefault(require("./events/requestEvent"));
const joinPrivateRoom_1 = __importDefault(require("./middlewares/socket/joinPrivateRoom"));
const joinMessageRoom_1 = __importDefault(require("./middlewares/socket/joinMessageRoom"));
const messageEvents_1 = __importDefault(require("./events/messageEvents"));
const cors_1 = __importDefault(require("cors"));
const requestRoutes_1 = __importDefault(require("./v1/routes/requestRoutes"));
const notificationRoutes_1 = __importDefault(require("./v1/routes/notificationRoutes"));
const app = (0, express_1.default)();
(0, connect_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "*" }));
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/messages", messageRoutes_1.default);
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/requests", requestRoutes_1.default);
app.use("/api/v1/notifications", notificationRoutes_1.default);
const httpServer = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.use(joinPrivateRoom_1.default);
io.use(joinMessageRoom_1.default);
io.on("connection", (socket) => {
    socket.onAny((...arg) => {
        console.log(arg);
    });
    requestEvent_1.default.handle.creation(io, socket);
    requestEvent_1.default.handle.accept(io, socket);
    requestEvent_1.default.handle.refuse(io, socket);
    messageEvents_1.default.handle.push(io, socket);
});
exports.default = httpServer;