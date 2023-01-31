"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFormater = void 0;
const beforeRegistration = (req) => {
    return {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: {
            address: req.body.email,
            verified: false,
        },
        password: req.body.password,
    };
};
const beforeLogin = (req) => {
    return {
        email: req.body.email,
        password: req.body.password,
    };
};
exports.UserFormater = {
    beforeRegistration,
    beforeLogin,
};
