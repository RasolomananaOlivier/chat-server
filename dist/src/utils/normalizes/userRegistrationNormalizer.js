"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegistrationNormalizer = void 0;
const userRegistrationNormalizer = (req) => {
    return {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
    };
};
exports.userRegistrationNormalizer = userRegistrationNormalizer;
