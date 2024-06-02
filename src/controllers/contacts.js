import { Router } from 'express';
import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  patchContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const routerContacts = Router();

const handleHttpError = (status, message) => {
  throw createHttpError(status, { message });
};
//обробник для отримання всіх контактів
export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 'success',
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// Обробик для отримання контакту по ID
export const getContactIdController = async (req, res, next) => {
  const { contactId } = req.params;

  // Проверка валидности ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(handleHttpError(404, 'Contact not found'));
  }

  const contact = await getContactById(contactId); // Реєстрація роута для отримання контакту за ID

  if (!contactId) {
    return next(handleHttpError(404, 'Contact not found', res, next));
  }

  res.status(200).json({
    status: 'success',
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body; // Прямое использование req.body
  if (!name || !phoneNumber) {
    return next(
      createHttpError(400, { message: 'Name and phone number are required' }),
    );
  }

  const contact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(404, 'Contact not found'));
  }
  const contact = await deleteContactById(contactId);
  if (!contact) return next(createHttpError(404, 'Contact not found'));

  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const updateContact = await patchContact(contactId, req.body);
  if (!updateContact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully created a contact!',
    data: updateContact,
  });
};
