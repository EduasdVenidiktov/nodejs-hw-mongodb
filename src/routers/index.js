import { Router } from 'express';
import authRouter from './auth.js';
import contactsRouter from './contacts.js';

const mainRouter = Router();
mainRouter.use('/contacts', contactsRouter);
mainRouter.use('/auth', authRouter);

export default mainRouter;
