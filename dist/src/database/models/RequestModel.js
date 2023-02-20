"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RequestSchema = new mongoose_1.Schema({
    destinationId: { type: String, require: true },
    originId: { type: String, require: true },
    message: { type: String, require: true },
});
const RequestModel = (0, mongoose_1.model)("Request", RequestSchema);
exports.default = RequestModel;
