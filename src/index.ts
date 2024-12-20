import express , {Request, Response,NextFunction} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/Dbconn';
import authMiddleware from './middleware/middleware';
import { Usermodel } from './db/dbschema';
import userrouter from './routes/user';
import tagrouter from './routes/tags';
import contentrouter from './routes/content';
import brainrouter from './routes/brains';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/v1/user', userrouter);
app.use('/api/v1/tag', tagrouter);
app.use('/api/v1/content', contentrouter);
app.use('/api/v1/brain', brainrouter);

async function main() {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    } catch (error) {
        console.log(error);
    }
}

main();

export default app;