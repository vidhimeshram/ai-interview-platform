// controllers/interviewFlowController.js
import Interview from "../models/interviewModel.js";
import Question from "../models/questionModel.js";
import { evaluateAnswer, generateOverallFeedback } from "../services/aiEvaluationService.js";

// @route   POST /api/interviews/:interviewId/start
// @desc    Start (or resume) an interview. Sets status to inprogress and returns first unanswered question.
// @access  Private
export const startInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        if (interview.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized for this interview" });
        }
        if (interview.status === "comleted") {
            return res.status(400).json({ success: false, message: "Interview already completed" });
        }

        const questions = await Question.find({ interview: interviewId }).sort({ order: 1 });
        if (questions.length === 0) {
            return res.status(400).json({ success: false, message: "No questions generated for this interview yet" });
        }

        if (interview.status === "pending") {
            interview.status = "inprogress";
            await interview.save();
        }

        const nextQuestion = questions.find((q) => !q.answer || q.answer.trim() === "");

        return res.status(200).json({
            success: true,
            interviewId: interview._id,
            status: interview.status,
            totalQuestions: questions.length,
            answeredCount: questions.filter((q) => q.answer && q.answer.trim() !== "").length,
            currentQuestion: nextQuestion || null,
        });
    } catch (error) {
        console.error("startInterview error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   POST /api/interviews/questions/:questionId/answer
// @desc    Submit an answer for a question, triggers AI evaluation. Marks interview complete if it was the last one.
// @access  Private
export const submitAnswer = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { answer } = req.body;

        if (!answer || !answer.trim()) {
            return res.status(400).json({ success: false, message: "answer is required" });
        }

        const question = await Question.findById(questionId).populate("interview");
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }
        if (question.interview.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized for this question" });
        }
        if (question.interview.status === "comleted") {
            return res.status(400).json({ success: false, message: "Interview already completed" });
        }

        // Run AI evaluation
        const evaluation = await evaluateAnswer(question.questionText, answer);

        question.answer = answer;
        question.score = evaluation.score;
        question.feedback = evaluation.feedback;
        await question.save();

        // Check whether all questions for this interview are now answered
        const allQuestions = await Question.find({ interview: question.interview._id }).sort({ order: 1 });
        const unanswered = allQuestions.filter((q) => !q.answer || q.answer.trim() === "");

        let interviewCompleted = false;
        let overallScore = null;
        let overallFeedback = null;

        if (unanswered.length === 0) {
            const overall = await generateOverallFeedback(allQuestions);
            overallScore = overall.overallScore;
            overallFeedback = overall.overallFeedback;

            const interview = await Interview.findById(question.interview._id);
            interview.status = "comleted";
            interview.score = overallScore;
            interview.feedback = overallFeedback;
            await interview.save();

            interviewCompleted = true;
        }

        return res.status(200).json({
            success: true,
            evaluation: { score: question.score, feedback: question.feedback },
            interviewCompleted,
            nextQuestion: interviewCompleted ? null : unanswered[0],
            overallScore,
            overallFeedback,
        });
    } catch (error) {
        console.error("submitAnswer error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/interviews/:interviewId/results
// @desc    Full results breakdown for one interview
// @access  Private
export const getResults = async (req, res) => {
    try {
        const { interviewId } = req.params;

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        if (interview.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized for this interview" });
        }

        const questions = await Question.find({ interview: interviewId }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            interview: {
                id: interview._id,
                title: interview.title,
                company: interview.company,
                role: interview.role,
                status: interview.status,
                score: interview.score,
                feedback: interview.feedback,
            },
            questions,
        });
    } catch (error) {
        console.error("getResults error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/interviews/dashboard/summary
// @desc    Dashboard stats across all of the logged-in user's interviews
// @access  Private
export const getDashboard = async (req, res) => {
    try {
        const interviews = await Interview.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

        const completed = interviews.filter((i) => i.status === "comleted");
        const inProgress = interviews.filter((i) => i.status === "inprogress");
        const pending = interviews.filter((i) => i.status === "pending");

        const avgScore =
            completed.length > 0
                ? Math.round(
                      (completed.reduce((sum, i) => sum + (i.score || 0), 0) / completed.length) * 10
                  ) / 10
                : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalInterviews: interviews.length,
                completedInterviews: completed.length,
                inProgressInterviews: inProgress.length,
                pendingInterviews: pending.length,
                averageScore: avgScore,
            },
            recentInterviews: interviews.slice(0, 5).map((i) => ({
                id: i._id,
                title: i.title,
                company: i.company,
                role: i.role,
                status: i.status,
                score: i.score,
            })),
        });
    } catch (error) {
        console.error("getDashboard error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};