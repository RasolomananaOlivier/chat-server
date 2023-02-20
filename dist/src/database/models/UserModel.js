"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    email: {
        address: { type: String, require: true },
        verified: { type: Boolean, require: false },
    },
    password: { type: String, require: true },
    friends: [String],
    avatarUrl: String,
    birthday: String,
});
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt_1.default.hash(user.password, 8);
    }
    next();
});
userSchema.methods.getFullname = function () {
    return `${this.firstname} ${this.lastname}`;
};
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
