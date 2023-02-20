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
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
(0, connect_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/messages", messageRoutes_1.default);
app.use("/api/v1/auth", authRoutes_1.default);
app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
