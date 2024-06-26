import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/Contact.js';
import { SORT_ORDER } from '../index.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFile } from '../utils/saveFile.js';

//Function 'getAllStudents' executes a query to the contact`s collection in the database, retrieves a list of contacts with pagination, and returns the data along with pagination metadate.
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage; //quantity of items per page
  const skip = (page - 1) * perPage; //the quantity of items to skip in order to start from the desired page

  const contactsQuery = ContactsCollection.find({ userId: filter.userId });

  // Add filtration for 'isFavourite'
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactsQuery.getFilter()), //Receiving total quantity of contacts
    contactsQuery
      .skip(skip) //if page = 2 and perPage = 10, then skip = 10, meaning 10 documents will be skipped
      .limit(limit) //limits the quantity of documents that will be returned in the query result. If perPage = 10, only 10 documents will be selected.
      .sort({ [sortBy]: sortOrder }) //The 'sort' method sorts documents in the collection by a specific field (sortBy) in the specified order (sortOrder). Using square brackets { [sortBy]: sortOrder } allows for dynamically specifying the field to sort by. For example, if sortBy = 'name' and sortOrder = 'asc', then { [sortBy]: sortOrder } is equivalent to { name: 'asc' }.
      .exec(), // executes the command
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  // Checking for page existence
  if (page > paginationData.totalPages) {
    throw createHttpError(404, 'Page not found');
  }
  return {
    data: contacts,
    ...paginationData, //Metadata - these are data that provide additional information about other data, such as the number of available items, the current page, the total number of pages, the presence of a previous or next page, etc.
  };
};

//authorization
export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId }); //authorization
  return contact;
};

export const createContact = async (photo, ...payload) => {
  const url = await saveFile(photo);

  const contact = await ContactsCollection.create({
    ...payload,
    photo: url,
  });

  return contact;
};

export const patchContact = async (contactId, payload, userId) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return contact;
};

export const deleteContactById = async (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};
