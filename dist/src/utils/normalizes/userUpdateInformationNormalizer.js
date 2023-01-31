"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeReqBeforeUserUpdate = void 0;
const normalizeReqBeforeUserUpdate = (req) => {
    return {
        userId: req.params.userId,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
    };
};
exports.normalizeReqBeforeUserUpdate = normalizeReqBeforeUserUpdate;
