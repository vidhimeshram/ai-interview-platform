import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import connectDB from './config/db.js';
import interviewRoutes from './routes/interviewRoute.js';
import interviewQuestionRoutes from "./routes/interviewQuestionRoutes.js";
import authRoute from "./routes/authRoute.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root (where MONGO_URI and PORT are defined)
dotenv.config({ path: path.join(__dirname, '../../.env') });

//middleware
app.use("/api/auth", authRoute);
app.use('/api/interviews', interviewRoutes);
app.use("/api/questions", interviewQuestionRoutes);

const PORT = process.env.PORT || 3000;

// Start the server only after the database connection succeeds
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

