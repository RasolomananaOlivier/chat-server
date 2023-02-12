import express from "express";
import RequestController from "../../controllers/requestControllers";

const RequestRoutes = express.Router();

RequestRoutes.get("/", RequestController.getRequests);

// Get all requests for userId
RequestRoutes.get("/:userId", RequestController.getAllRequests);

export default RequestRoutes;
