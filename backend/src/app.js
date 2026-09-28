import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import authRoute from './routes/authRoute.js';

const app = express();

//middlewares
app.use(cors());
app.use(cookieparser());
app.use(express.json());

//test
app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;

