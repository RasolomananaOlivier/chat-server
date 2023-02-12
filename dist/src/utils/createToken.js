"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (payload) => {
    const token = (0, jsonwebtoken_1.sign)(JSON.stringify(payload), process.env.SECRET_KEY);
    return token;
};
exports.createToken = createToken;
