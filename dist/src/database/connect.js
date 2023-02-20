"use strict";
const mongoose = require("mongoose");
const DATABASE = process.env.DATABASE_URI || "mongodb://localhost:27017/quicktalks";
const dbConnection = () => {
    mongoose
        .connect(DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
        .then(() => {
        console.info("> Mongodb connected");
    })
        .catch(() => {
        console.log("> Failed to connected to mongodb");
    });
};
module.exports = dbConnection;
