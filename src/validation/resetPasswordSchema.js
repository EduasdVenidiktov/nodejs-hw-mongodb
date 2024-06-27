import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  token: Joi.string().required(),
});
