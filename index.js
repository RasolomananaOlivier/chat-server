const express = require("express");
const dbConnection = require("./src/database/connect");
const AuthRoutes = require("./src/v1/routes/authRoutes");
const MessageRoutes = require("./src/v1/routes/messageRoutes");
const UserRoutes = require("./src/v1/routes/userRoutes");
const app = express();

const port = process.env.PORT || 5000;

dbConnection();

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/messages", MessageRoutes);
app.use("/api/v1/auth", AuthRoutes);

// TODO: Upgrade to typescript
app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
