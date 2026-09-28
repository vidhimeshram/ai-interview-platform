import Router from "express";
import { protect } from "../middleware/authMiddleware.js";
import * as interviewController from "../controllers/interviewController.js";

const router = Router();

// Create interview
router.post("/", protect, interviewController.createInterview);

// Get my interviews
router.get("/my-interviews", protect, interviewController.getMyInterviews);

// Get interview by ID
router.get("/:id", protect, interviewController.getInterviewById);

// Update interview
router.put("/:id", protect, interviewController.updateInterview);

// Delete interview
router.delete("/:id", protect, interviewController.deleteInterview);

export default router;