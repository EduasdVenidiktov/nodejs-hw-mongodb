import Joi from 'joi';

export const requestResetEmailSchema = Joi.object({
  //   email: Joi.string().min(3).max(20).email().required('bcrypt'),
  email: Joi.string().email().required(),
});
