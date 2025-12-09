import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";

const FeedbackRoutes = () => {
  const router = express.Router();

  router.post("/", submitFeedback);

  return router;
};

export default FeedbackRoutes();

