import Interview from "../models/interviewModel.js";

// CREATE INTERVIEW
export const createInterview = async (req, res) => {
    try {
        const { title, company, role, experienceLevel, difficulty, techStack, numberOfQuestions } = req.body;
        const interview = await Interview.create({
            title,
            company,
            role,
            experienceLevel,
            difficulty,
            techStack,
            numberOfQuestions,
            createdBy: req.user._id,
            createdAt: new Date(),
        });
        res.status(201).json(interview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET MY INTERVIEWS
export const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            createdBy: req.user._id,
        }).sort({ createdAt: -1 });
        res.status(200).json(interviews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET INTERVIEW BY ID
export const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        // Only the owner can view it
        if (interview.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        return res.status(200).json({
            success: true,
            interview
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE INTERVIEW
export const updateInterview = async (req, res) => {
    try {
        const {
            title, company, role, experienceLevel, difficulty, techStack, numberOfQuestions
        } = req.body;
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }
        // only owner can update it
        if (interview.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorised"
            });
        }
        interview.title = title ?? interview.title;
        interview.company = company ?? interview.company;
        interview.role = role ?? interview.role;
        interview.experienceLevel = experienceLevel ?? interview.experienceLevel;
        interview.difficulty = difficulty ?? interview.difficulty;
        interview.techStack = techStack ?? interview.techStack;
        interview.numberOfQuestions = numberOfQuestions ?? interview.numberOfQuestions;

        const updatedInterview = await interview.save();

        res.status(200).json({
            success: true,
            message: "Interview updated successfully",
            interview: updatedInterview
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE INTERVIEW
export const deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        // Make sure only the owner can delete it
        if (interview.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this interview"
            });
        }

        await interview.deleteOne();

        res.status(200).json({
            success: true,
            message: "Interview deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
