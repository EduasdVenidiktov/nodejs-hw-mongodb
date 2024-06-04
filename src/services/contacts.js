import { ContactsCollection } from '../db/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

//Функція getAllStudents виконує запит до колекції студентів у базі даних, отримує список студентів з урахуванням пагінації та повертає дані разом з метаданими пагінації.
export const getAllContacts = async ({ page, perPage }) => {
  const limit = perPage; //кількість елементів на сторінці
  const skip = (page - 1) * perPage; //Кількість елементів, які потрібно пропустити, щоб почати з потрібної сторінки

  const contactsQuery = ContactsCollection.find();

  // const contactsCount = await ContactsCollection.find()
  //   .merge(contactsQuery)
  //   .countDocuments();
  const contactsCount = await ContactsCollection.countDocuments(); // отримання загальної кількості контактів
  const contacts = await contactsQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const patchContact = async (contactId, payload) => {
  const contact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true },
  );
  return contact;
};

export const deleteContactById = async (contactId) => {
  return ContactsCollection.findByIdAndDelete(contactId);
};

//==================ДЗ 3=============================================
// import { ContactsCollection } from '../db/Contact.js';

// export const getAllContacts = async () => {
//   const contacts = await ContactsCollection.find();
//   return contacts;
// };

// export const getContactById = async (contactId) => {
//   const contact = await ContactsCollection.findById(contactId);
//   return contact;
// };

// export const createContact = async (payload) => {
//   const contact = await ContactsCollection.create(payload);
//   return contact;
// };

// export const patchContact = async (contactId, payload) => {
//   const contact = await ContactsCollection.findByIdAndUpdate(
//     contactId,
//     payload,
//     { new: true },
//   );
//   return contact;
// };

// export const deleteContactById = async (contactId) => {
//   return ContactsCollection.findByIdAndDelete(contactId);
// };
