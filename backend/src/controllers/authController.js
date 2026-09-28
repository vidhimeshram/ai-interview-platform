import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password before saving to database
        const hashPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const user = await User.create({ 
            name, 
            email, 
            password: hashPassword 
        });

        // Structure response to remove password leak
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        };

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse
        });

    } 
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 2. LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare hashed password safely using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        //Generate JWT token
        const token = jwt.sign(
            {
                id:user._id,
                email:user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        //prepare response
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: userResponse,
        });
   
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// 3. LOGOUT USER
export const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

 export const getProfile = async (req, res) => {
    try{
        return res.status(200).json({
            success:true,
            user:req.user,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
            
        };

        //update profile
        export const updateProfile = async (req, res) =>{
            try{

            
            const { name, bio, skills, github, Linkedin, profilePicture } = req.body;
            
            //logged in user
            const user = await User.findById(req.user._id);
            if(!user){
                return res.status(404).json({
                    success:false,
                    message:"User not found",
                });

            }
            //updte field
            user.name = name || user.name;
            user.bio = bio || user.bio;
            user.skills = skills || user.skills;
            user.github = github || user.github;
            user.Linkedin = Linkedin || user.Linkedin;

            if(skills){
                user.skills = skills.split(",").map(skill => skill.trim());

            }

            //save
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                user: user
            });

        }catch(error){
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    //change password
    export const changePassword = async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;

            // Find user by ID
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Compare old password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid old password"
                });
            }

            // Hash new password
            const hashPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            user.password = hashPassword;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };