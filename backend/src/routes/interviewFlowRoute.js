// routes/interviewFlowRoute.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    startInterview,
    submitAnswer,
    getResults,
    getDashboard,
} from "../controllers/interviewFlowController.js";

const router = express.Router();

router.post("/:interviewId/start", protect, startInterview);
router.post("/questions/:questionId/answer", protect, submitAnswer);
router.get("/:interviewId/results", protect, getResults);
router.get("/dashboard/summary", protect, getDashboard);

export default router;

// In app.js:
// import interviewFlowRoute from "./routes/interviewFlowRoute.js";
// app.use("/api/interviews", interviewFlowRoute);
//
// NOTE: mount this AFTER your existing interviewRoute.js if that one also
// uses "/api/interviews", so route ordering doesn't cause conflicts —
// or better, check interviewRoute.js/interviewQuestionRoutes.js and merge
// these paths in if they already use "/api/interviews" as a base.