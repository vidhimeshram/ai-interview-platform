import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    createQuestion,
    getInterviewQuestions
} from "../controllers/interviewQuestionController.js";

const router = express.Router();

router.post("/", protect, createQuestion);

router.get("/:interviewId", protect, getInterviewQuestions);

export default router;