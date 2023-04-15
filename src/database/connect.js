const mongoose = require("mongoose");

const dbConnection = () => {
  let DATABASE;

  if (process.env.NODE_ENV === "production") {
    DATABASE = process.env.DATABASE_URI;
  } else {
    DATABASE = "mongodb://localhost:27017/quicktalks";
  }

  console.log("DATABASE", process.env.NODE_ENV, DATABASE);
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
