import { Router } from 'express';
import { ctrlWrapper } from './contacts';
import { validateBody } from '../controllers/contacts';
import { loginUserSchema, registerUserSchema } from '../db/Contact';
import {
  loginUserController,
  registerUserController,
} from '../controllers/auth';

const router = Router();

router.post(
  'auth/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  'auth/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
export default router;
