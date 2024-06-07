const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string'; //перевіряється, чи є number рядком (string)
  if (!isString) return defaultValue; //Якщо number не є рядком, функція негайно повертає defaultValuey

  const parsedNumber = parseInt(number, 10); //parseInt('123abc') поверне 123
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }
  return parsedNumber;
};
// parseNumber('42', 0) поверне 42, оскільки рядок '42' успішно парситься в число.
// parseNumber('abc', 0) поверне 0, оскільки рядок 'abc' не можна парсити в число і результатом буде NaN.
// parseNumber(123, 0) поверне 0, оскільки вхідне значення не є рядком.
// parseNumber('123abc', 0) поверне 123, оскільки parseInt парсить початок рядка до першого некоректного символу.

export const parsePaginationParams = (query) => {
  let page = parseNumber(query.page, 1);
  let perPage = parseNumber(query.perPage, 10);
  return { page, perPage };
};
