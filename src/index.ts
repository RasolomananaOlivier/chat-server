import express from "express";
import dbConnection from "./database/connect";
import AuthRoutes from "./v1/routes/authRoutes";
import MessageRoutes from "./v1/routes/messageRoutes";
import UserRoutes from "./v1/routes/userRoutes";
const app = express();

const port = process.env.PORT || 5000;

dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/messages", MessageRoutes);
app.use("/api/v1/auth", AuthRoutes);

// TODO: Upgrade to typescript
app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
