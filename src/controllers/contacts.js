import {
  deleteContactById,
  getAllContacts,
  getContactById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { ContactsCollection } from '../db/models/Contact.js';

import { saveFile } from '../utils/saveFile.js';

//handler for receiving all contacts
export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query); //The controller retrieves the values of 'page' and 'perPage' from the request parameters (req.query) and converts them into valid numerical values, using default values if necessary.
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const { isFavourite } = req.query;

  const filter = { isFavourite, userId: req.user._id };

  //this function adressed to DB to received the contacts`s list with the corresponding pagination
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id, //authorization
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// Handler for receiving a contact by ID
export const getContactIdController = async (req, res, next) => {
  const { contactId } = req.params;

  //Authorization
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId); // filtration by userId

  // Check validate ObjectId  66619380634fbf5df3ec245a7777777777
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: null,
    });
  }

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 'success',
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const { body, file } = req;
  try {
    let photoUrl;

    if (file) {
      photoUrl = await saveFile(file);
    }

    const contact = await ContactsCollection.create({
      ...body,
      userId: req.user._id, // Authorization
      photo: photoUrl,
    });

    const contactObj = contact.toObject();
    const { photo, ...rest } = contactObj;

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: { ...rest, photo },
    });
  } catch (error) {
    next(error); // errors handling
  }
};

export const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id; //authorization

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(404, 'Contact not found'));
  }
  const contact = await deleteContactById(contactId, userId); //authorization
  if (!contact) return next(createHttpError(404, 'Contact not found'));

  res.status(204).send(); //without 'message', without 'send()' will be freeze
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  try {
    let photoUrl;

    if (photo) {
      photoUrl = await saveFile(photo);
    }

    const updateData = {
      ...req.body,
    };

    if (photo) {
      updateData.photo = photoUrl;
    }

    const contact = await ContactsCollection.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true },
    );

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    // Remove photoUrl from the contact object
    const contactObj = contact.toObject();
    delete contactObj.photoUrl;

    res.json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: contactObj,
    });
  } catch (error) {
    console.error('Error in updateContactController:', error);
    next(createHttpError(500, 'Something went wrong'));
  }
};
