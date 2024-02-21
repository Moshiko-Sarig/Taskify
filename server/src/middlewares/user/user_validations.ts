import { Request, Response, NextFunction } from 'express';
import UserModel from '../../models/user.model';
import Credentials from './credentials'; 

export const validateUserRegistration = async (req: Request, res: Response, next: NextFunction) => {
  const { first_name, last_name, username, email, password } = req.body;


  const userCredentials = new Credentials({ email, password, username });
  const validationErrors = userCredentials.validate();

 
  if (validationErrors) {
    return res.status(400).json({ message: validationErrors.join(", ") });
  }

  
  if (!first_name || !last_name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }


  const emailExists = await UserModel.checkIfEmailExists(email);
  if (emailExists.length > 0) {
    return res.status(400).json({ message: 'Email already exists' });
  }


  const usernameExists = await UserModel.checkIfUsernameExists(username);
  if (usernameExists.length > 0) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  next(); 
};
