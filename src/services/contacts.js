import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/Contact.js';
import { SORT_ORDER } from '../index.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

//Функція getAllStudents виконує запит до колекції студентів у базі даних, отримує список студентів з урахуванням пагінації та повертає дані разом з метаданими пагінації.
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage; //кількість елементів на сторінці
  const skip = (page - 1) * perPage; //Кількість елементів, які потрібно пропустити, щоб почати з потрібної сторінки

  const contactsQuery = ContactsCollection.find({ userId: filter.userId });

  // Додаємо фільтрацію за isFavourite
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactsQuery.getFilter()), //отримання загальної кількості контактів
    contactsQuery
      .skip(skip) //якщо page = 2 і perPage = 10, то skip = 10, тобто буде пропущено 10 документів.
      .limit(limit) //обмежує кількість документів, які будуть повернуті в результаті запиту.якщо perPage = 10, то буде вибрано лише 10 документів.
      .sort({ [sortBy]: sortOrder }) //Метод sort сортує документи у колекції за певним полем (sortBy) у вказаному порядку (sortOrder).Використання квадратних дужок { [sortBy]: sortOrder } дозволяє динамічно вказувати поле для сортування. Наприклад, якщо sortBy = 'name' і sortOrder = 'asc', то { [sortBy]: sortOrder } еквівалентно { name: 'asc' }.
      .exec(), //команда виконай
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  // Перевірка на існування сторінки
  if (page > paginationData.totalPages) {
    throw createHttpError(404, 'Page not found');
  }
  return {
    data: contacts,
    ...paginationData, //Метадані - це дані, які надають додаткову інформацію про інші дані/ про кількість доступних елементів, поточну сторінку, загальну кількість сторінок, наявність попередньої або наступної сторінки тощо
  };
};

//авторизація
export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId }); //авторизація
  return contact;
};

export const createContact = async (photo, ...payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const patchContact = async (contactId, payload, userId) => {
  const contact = await ContactsCollection.findOneAndDelete(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return contact;
};

export const deleteContactById = async (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};
