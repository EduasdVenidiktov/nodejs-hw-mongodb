import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  patchContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

//обробник для отримання всіх контактів
export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query); //контролер витягує з параметрів запиту (req.query) значення page та perPage, і перетворює їх на коректні числові значення з використанням значень за замовчуванням, якщо це необхідно
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const { isFavourite } = req.query;

  const filter = { isFavourite, userId: req.user._id };

  //Ця функція, звертається до бази даних для отримання списку студентів з відповідною пагінацією.
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id, //авторизація
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// Обробик для отримання контакту по ID
export const getContactIdController = async (req, res) => {
  const { contactId } = req.params;

  //авторизація
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId); // фильтрация по userId

  // Перевірка валідності ObjectId  66619380634fbf5df3ec245a7777777777
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: null,
    });
  }

  res.status(200).json({
    status: 'success',
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body; // деструктуризуємо, щоб витягнути значення полів з req.body - містить дані, що були надіслані у тілі HTTP-запиту.

    const contact = await createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user._id, //авторизація
    }); //createContact — функція, яка створює новий контакт у базі даних за допомогою отриманих даних та зберігається в contact.

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error); //Якщо під час виконання виникає помилка, вона буде передана до наступного обробника помилок у ланцюжку middleware за допомогою next(error)
  }
};

export const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id; //авторизація

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(404, 'Contact not found'));
  }
  const contact = await deleteContactById(contactId, userId); //авторизація
  if (!contact) return next(createHttpError(404, 'Contact not found'));

  res.status(204).send(); //без повідомлення, без send() буде зависати
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id; //авторизація

  const updateContact = await patchContact(contactId, req.body, userId); //авторизація
  if (!updateContact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully created a contact!',
    data: updateContact,
  });
};
