import Router from 'express';
import {
  createContactController,
  deleteContactByIdController,
  getContactIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';

const routerContacts = Router();

export const ctrlWrapper = (controller) => {
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
routerContacts.post('/contacts', ctrlWrapper(createContactController));

routerContacts.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactByIdController),
);

routerContacts.patch(
  '/contacts/:contactId',
  ctrlWrapper(patchContactController),
);

export default routerContacts;

// //============= ДЗ 4 ========================
// import Router from 'express';
// import {
//   createContactController,
//   deleteContactByIdController,
//   getContactIdController,
//   getContactsController,
//   patchContactController,
//   validateBody,
// } from '../controllers/contacts.js';
// import { createContactsSchema, updateContactsSchema } from '../db/Contact.js';

// const routerContacts = Router();

// export const ctrlWrapper = (controller) => {
//   return async (req, res, next) => {
//     try {
//       await controller(req, res, next);
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// routerContacts.get('/contacts', ctrlWrapper(getContactsController));
// routerContacts.get('/contacts/:contactId', ctrlWrapper(getContactIdController));

// routerContacts.post(
//   '/contacts',
//   validateBody(createContactsSchema),
//   ctrlWrapper(createContactController),
// );

// routerContacts.delete(
//   '/contacts/:contactId',
//   ctrlWrapper(deleteContactByIdController),
// );

// routerContacts.patch(
//   '/contacts/:contactId',
//   validateBody(updateContactsSchema),
//   ctrlWrapper(patchContactController),
// );

// export default routerContacts;
