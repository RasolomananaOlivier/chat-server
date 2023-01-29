"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = exports.userRegistrationRules = void 0;
const express_validator_1 = require("express-validator");
const userRegistrationRules = () => {
    return [
        (0, express_validator_1.body)("firstname").isString().notEmpty(),
        (0, express_validator_1.body)("lastname").isString().notEmpty(),
        (0, express_validator_1.body)("email").isEmail(),
        (0, express_validator_1.body)("password").isString(),
    ];
};
exports.userRegistrationRules = userRegistrationRules;
const validateRegistration = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
};
exports.validateRegistration = validateRegistration;
