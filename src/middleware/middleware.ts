import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Usermodel } from '../db/dbschema';



dotenv.config();

const jwtSecret = process.env.JWT_SECRET ||"Rajesh@friedman235";


interface CustomRequest extends Request {
    user?: any;
}

async function auth(req: CustomRequest, res: Response, next: NextFunction):Promise<any> {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({ message: 'No token found'

             })
              return;
        }
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        console.log(decoded);
        const user = await Usermodel.findById(decoded.id);
        if(!user){
            return res.status(401).json({ message: 'Invalid token'

             })
              return;
        }
        req.user = user;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({ message: 'Invalid token'

         })
          return;
    }
    
}


export default auth;
