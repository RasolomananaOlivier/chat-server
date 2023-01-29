"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.userLoginRoules = void 0;
const express_validator_1 = require("express-validator");
const userLoginRoules = () => {
    return [(0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isString()];
};
exports.userLoginRoules = userLoginRoules;
const validateLogin = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
};
exports.validateLogin = validateLogin;
