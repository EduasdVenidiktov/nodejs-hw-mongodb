import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({}),
  email: Joi.string().min(3).max(20).email().required('bcrypt'),
  password: Joi.string().min(8).max(20).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().min(3).max(20).email().required('bcrypt'),
  password: Joi.string().min(8).max(20).required(),
});
