import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            default: null,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
        bio:{
            type:String,
            default:"",
        },
        skills:{
            type:[String],
            default:[]
        },
        github:{
            type:String,
            default:"",
        },
        Linkedin:{
            type:String,
            default:"",
        },
        profilePicture:{
            type:String,
            default: "",
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
