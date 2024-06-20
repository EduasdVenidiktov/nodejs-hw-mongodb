import Router from 'express';

import {
  createContactController,
  deleteContactByIdController,
  getContactIdController,
  getContactsController,
  updateContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createContactsSchema } from '../validation/createContactsSchema.js';
import { updateContactsSchema } from '../validation/updateContactsSchema.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', ctrlWrapper(getContactIdController));

contactsRouter.post(
  '/',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactByIdController));

contactsRouter.patch(
  '/:contactId',
  validateBody(updateContactsSchema),
  ctrlWrapper(updateContactController),
);

export default contactsRouter;
