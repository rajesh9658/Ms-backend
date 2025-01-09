import jwt from 'jsonwebtoken';
import z, { any } from 'zod';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import bcrypt from 'bcrypt'
import { Usermodel,Contentmodel } from '../db/dbschema';
import  authMiddleware from "../middleware/middleware";

const JWT_SECRET = process.env.JWT_SECRET ||"Rajesh@friedman235";

const userrouter = Router();


userrouter.get('/test', async (req, res) => {
    res.json({ message: 'test route working fine' });
})


userrouter.post('/register', async (req: Request, res: Response):Promise<any> => {    // Zod validation schema
    const requirebody = z.object({
        username: z.string().min(3).max(20),
        password: z.string().min(6).max(20),
        email: z.string().email(),
    });

    try {
        // Parsing the request body with Zod
        const parsedbody = requirebody.parse(req.body);

        // Accessing parsed fields
        const { username, password, email } = parsedbody;

        // Password hashing & saving user to database
        const hashedPassword = await bcrypt.hash(password, 10);
        await Usermodel.create({ username, password: hashedPassword, email });

        res.json({ message: 'User created successfully' });
    } catch (error) {
        // Handling Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid body', errors: error.errors });
        }

        // Handling other errors
        console.error(error);
        res.status(500).json({ message: 'User creation failed' });
    }
});


userrouter.post('/login', async (req: Request, res: Response):Promise<any> => {

    const {username, password} = req.body;


    const user = await Usermodel.findOne({username});
    if(!user){
        return res.status(401).json({ message: 'Invalid username or password'});
    }

    //password comparison
    const machedpassword = await bcrypt.compare(password, user.password);
  
    //asing token to user
    if(machedpassword){
        const token = jwt.sign({id: user._id.toString()},JWT_SECRET);
        res.json({
            user:{
                Id: user._id.toString(),
                username: user.username,
                email: user.email
            }
            , token});
        return;
    }
    return res.status(401).json({ message: 'Invalid username or password'});

})


interface User {
    _id: string;
    email: string;
    username: string;
    password: string;
}
interface CustomRequest extends Request {
    user?: User;
}


userrouter.get('/content',authMiddleware, async (req: CustomRequest, res: Response):Promise<void> => {
   
    try {
        const userId = req.user?._id;
        const userContent = await Contentmodel.find({userid: userId}).populate({
            path:'tags',
            select:'title'
         });

         res.status(200).json(userContent);
         return;
    }catch(error){
        console.log(error);
         res.status(500).json({ message: 'Content fetching failed'});
        return;
    }
});



export default userrouter;