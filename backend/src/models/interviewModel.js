/*title
company
role
difficulty
teckstack
number of questions
status
score
feedback
createdAt
createdBy
*/
import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required: true,
    },
    company:{
        type:String,
        required: true,
    },
    role:{
        type:String,
        required: true,
    },
    experienceLevel:{
        type:String,
        required: true,
    },
    difficulty:{
        type:String,
        required: true,
    },
    techStack:{
        type:[String],
        required: true,
    },
    numberOfQuestions:{
        type:Number,
        required: true,
    },

    status:{
        type:String,
        required:true,
        enum:["pending", "comleted","inprogress"],
        default:"pending",
    },
    score:{

    },
    feedback:{

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
},{
    timestamps: true,
}
    
);
export default mongoose.model("Interview", interviewSchema);

