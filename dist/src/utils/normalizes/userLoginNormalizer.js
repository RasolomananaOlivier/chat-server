"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginNormalizer = void 0;
const userLoginNormalizer = (req) => {
    return {
        email: req.body.email,
        password: req.body.password,
    };
};
exports.userLoginNormalizer = userLoginNormalizer;
