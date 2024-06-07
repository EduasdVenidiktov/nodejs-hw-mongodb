import Router from 'express';

import {
  createContactController,
  deleteContactByIdController,
  getContactIdController,
  getContactsController,
  updateContactController,
  validateBody,
} from '../controllers/contacts.js';
import { createContactsSchema, updateContactsSchema } from '../db/Contact.js';

const routerContacts = Router();

const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

routerContacts.get('/contacts', ctrlWrapper(getContactsController));
routerContacts.get('/contacts/:contactId', ctrlWrapper(getContactIdController));

routerContacts.post(
  '/contacts',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

routerContacts.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactByIdController),
);

routerContacts.patch(
  '/contacts/:contactId',
  validateBody(updateContactsSchema),
  ctrlWrapper(updateContactController),
);

export default routerContacts;
