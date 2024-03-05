import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CookieEnum } from './cookie.enum';
import ApplicationError from '../errors/application.error';


interface DecodedUser {
    user: {
        user_id: number;
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        password: string;
        email_verified: boolean;
    };
}

interface RequestWithUser extends Request {
    user: DecodedUser;
}


 function authenticateUser(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies[CookieEnum.Taskify_Cookie];
    if (!token) throw new ApplicationError('Access Denied', 401);
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET as string) as DecodedUser;
        (req as RequestWithUser).user = verified;
        next();
    } catch (err) {

        throw new ApplicationError('Invalid Token!', 400);
    }
}

export default authenticateUser;

