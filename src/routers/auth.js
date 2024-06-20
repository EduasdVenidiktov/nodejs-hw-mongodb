import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  resetPasswordController,
  sendResetPasswordEmailController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requestResetEmailSchema } from '../validation/requestResetEmailSchema.js';
import { resetPasswordSchema } from '../validation/resetPasswordSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post(
  '/refresh',
  ctrlWrapper(refreshUserSessionController),
  authenticate,
);

authRouter.post('/logout', ctrlWrapper(logoutUserController), authenticate);

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(sendResetPasswordEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
