import { SORT_ORDER } from '../index.js';

const parseSortOrder = (sortOrder) => {
  const isKnowOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnowOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  //Функція перевіряє, чи параметр sortBy (поле, за яким буде виконане сортування.)відповідає ключам контактів, за якими можна сортувати (наприклад, _id, name, phoneNumber і т.д.).
  const keyOfContacts = [
    '_id',
    'name',
    'phoneNumber',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];
  if (keyOfContacts.includes(sortBy)) {
    return sortBy;
  }
  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query; //розпакування об'єкта query

  const parsedSortOrder = parseSortOrder(sortOrder); //parseSortOrder: Перевіряє, чи передане значення sortOrder є відомим напрямом сортування (в порядку зростання або спадання).
  const parsedSortBy = parseSortBy(sortBy); //parseSortBy: Перевіряє, чи передане значення sortBy є допустимим полем для сортування (наприклад, _id, name, phoneNumber тощо).
  return {
    sortOrder: parsedSortOrder, //Повертається об'єкт, який містить оброблені значення параметрів сортування.
    sortBy: parsedSortBy,
  };
};
