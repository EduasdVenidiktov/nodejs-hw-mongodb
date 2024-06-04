// Функція calculatePaginationData повертає об'єкт з повною інформацією про пагінацію, включно з поточною сторінкою, кількістю елементів на сторінці, загальною кількістю елементів, загальною кількістю сторінок, індикаторами наявності наступної та попередньої сторінок.
// count: Загальна кількість контактів
// page: Номер поточної сторінки.
// perPage: Кількість елементів на одній сторінці.
export const calculatePaginationData = (count, page, perPage) => {
  const totalPages = Math.ceil(count / perPage); //обчислює загальну кількість сторінок,

  //Перевірка наявності наступної сторінки:
  const hasNextPage = Boolean(totalPages - 1); //можливо помилковий рядок
  //   const hasNextPage = page < totalPages; //застосувати цей рядок

  //Перевірка наявності попередньої сторінки:
  const hasPreviosPage = page !== 1; //Якщо поточна сторінка не є першою, тоді є попередня сторінка.
  //   const hasPreviosPage = page > 1; // перевірка наявності попередньої сторінки

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPage,
    hasPreviosPage,
  };
};
