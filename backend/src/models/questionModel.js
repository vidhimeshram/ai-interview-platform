import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true
        },

        questionText: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["Technical", "Behavioral", "Coding"],
            default: "Technical"
        },

        topic: {
            type: String,
            default: ""
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium"
        },

        order: {
            type: Number,
            required: true
        },

        answer: {
            type: String,
            default: ""
        },

        score: {
            type: Number,
            default: null
        },

        feedback: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;