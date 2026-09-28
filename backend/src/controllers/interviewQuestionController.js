import Question from "../models/questionModel.js";
import Interview from "../models/interviewModel.js";

// CREATE QUESTION
export const createQuestion = async (req, res) => {
    try {
        const {
            interviewId,
            questionText,
            type,
            topic,
            difficulty,
            order
        } = req.body;

        // Check whether the interview belongs to logged-in user
        const interview = await Interview.findOne({
            _id: interviewId,
            createdBy: req.user._id
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        // Create question
        const question = await Question.create({
            interview: interviewId,
            questionText,
            type,
            topic,
            difficulty,
            order
        });

        return res.status(201).json({
            success: true,
            message: "Question created successfully",
            question
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET QUESTIONS FOR AN INTERVIEW
export const getInterviewQuestions = async (req, res) => {
    try {
        const { interviewId } = req.params;

        // Check ownership of interview
        const interview = await Interview.findOne({
            _id: interviewId,
            createdBy: req.user._id
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        // Get questions
        const questions = await Question.find({
            interview: interviewId
        }).sort({ order: 1 });

        return res.status(200).json({
            success: true,
            count: questions.length,
            questions
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};