"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCreateValidation = void 0;
const express_validator_1 = require("express-validator");
const userCreateValidation = () => {
    return [
        (0, express_validator_1.body)("firstname").isString().notEmpty(),
        (0, express_validator_1.body)("lastname").isString().notEmpty(),
        (0, express_validator_1.body)("email").isEmail(),
        (0, express_validator_1.body)("password").isStrongPassword({ minLength: 4 }),
    ];
};
exports.userCreateValidation = userCreateValidation;
