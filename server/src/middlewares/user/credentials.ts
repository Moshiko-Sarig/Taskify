import Joi, { Schema } from 'joi';

class Credentials {
  email: string;
  password: string;
  username: string;

  constructor(credentials: { email: string; password: string; username: string }) {
    this.email = credentials.email;
    this.password = credentials.password;
    this.username = credentials.username
  }

  private static validationSchema: Schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email must be a valid email address.',
        'string.empty': 'Email is required.',
      }),
    password: Joi.string()
      .required()
      .min(3)
      .max(255)
      .messages({
        'string.empty': 'Password is required.',
        'string.min': 'Password must be at least 3 characters long.',
        'string.max': 'Password must be no longer than 255 characters.',
      }),
    username: Joi.string()
      .required()
      .min(3)
      .max(50)
      .messages({
        'string.empty': 'username is required.',
        'string.min': 'username must be at least 3 characters long.',
        'string.max': 'username must be no longer than 50 characters.',
      }),
  });

  validate(): string[] | null {
    const result = Credentials.validationSchema.validate(this, { abortEarly: false });
    return result.error ? result.error.details.map((err) => err.message) : null;
  }
}

export = Credentials;
