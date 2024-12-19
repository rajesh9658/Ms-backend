import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        if(!process.env.MONGODB_URI){
            throw new Error('No MongoDB URI found');
        }await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error: any) {
        console.log(error.message);
        process.exit(1);//exit the server if there is an error
    }
}

export default connectDB;