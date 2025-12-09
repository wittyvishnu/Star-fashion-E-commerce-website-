import Feedback from "../models/feedbackModel.js";

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    const feedback = await Feedback.create({ name, email, message });

    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedbackId: feedback._id,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res
      .status(500)
      .json({ message: "Error submitting feedback", error: error.message });
  }
};

