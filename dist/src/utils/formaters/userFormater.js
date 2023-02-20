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
        friends: [],
        avatarUrl: req.body.avatarUrl,
    };
};
const beforeLogin = (req) => {
    return {
        email: req.body.email,
        password: req.body.password,
    };
};
const beforeUpdate = (req) => {
    return {
        _id: req.params.userId,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        avatarUrl: req.body.avatarUrl,
        birthday: req.body.birthday,
    };
};
const beforeEmailUpdate = (req) => {
    return {
        userId: req.params.userId,
        email: req.body.email,
    };
};
const beforeHandlingRelation = (req) => {
    return {
        userId: req.params.userId,
        friendId: req.body.friendId,
    };
};
exports.UserFormater = {
    beforeRegistration,
    beforeLogin,
    beforeUpdate,
    beforeEmailUpdate,
    beforeHandlingRelation,
};
