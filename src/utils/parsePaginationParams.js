const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string'; //перевіряється, чи є number рядком (string)
  if (!isString) return defaultValue; //Якщо number не є рядком, функція негайно повертає defaultValuey

  const parsedNumber = parseInt(number); //parseInt('123abc') поверне 123
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  } //parseInt('abc') поверне NaN
};
// parseNumber('42', 0) поверне 42, оскільки рядок '42' успішно парситься в число.
// parseNumber('abc', 0) поверне 0, оскільки рядок 'abc' не можна парсити в число і результатом буде NaN.
// parseNumber(123, 0) поверне 0, оскільки вхідне значення не є рядком.
// parseNumber('123abc', 0) поверне 123, оскільки parseInt парсить початок рядка до першого некоректного символу.

export const parsePaginationParams = (query) => {
  let page = parseInt(query.page, 10) || 1;
  let perPage = parseInt(query.perPage, 10) || 10;
  return { page, perPage };
};

// export const parsePaginationParams = (query) => {
//   const { page, perPage } = query; //витягуєvj значення page та perPage з об'єкта query
//   const parsedPage = parseNumber(page, 1); //перетворює значення page на ціле число, якщо ні- повертає значення за замовчуванням 1.
//   const parsedPerPage = parseNumber(perPage, 10); //перетворює значення page на ціле число, якщо ні- повертає значення за замовчуванням 10.
//   //повертаєvj об'єкт з полями page та perPage, що містять парсені значення.
//   return {
//     page: parsedPage,
//     perPage: parsedPerPage,
//   };
// };
// Якщо query має значення { page: '2', perPage: '15' }, функція поверне { page: 2, perPage: 15 }, оскільки обидва значення успішно парсяться на цілі числа.
// Якщо query має значення { page: 'abc', perPage: '15' }, функція поверне { page: 1, perPage: 15 }, оскільки page: 'abc' не можна перетворити на число і використовується значення за замовчуванням 1.
// Якщо query має значення { page: '2' }, функція поверне { page: 2, perPage: 10 }, оскільки perPage відсутнє і використовується значення за замовчуванням 10.
