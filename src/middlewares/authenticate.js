// import createHttpError from 'http-errors';
// import { User } from '../db/models/user.js';
// import { Session } from '../db/models/session.js';

// //Middleware authenticate виконує процес аутентифікації користувача, перевіряючи наявність та дійсність токена доступу в заголовку запиту
// export const authenticate = async (req, res, next) => {
//   //Функція приймає об'єкти запиту (req), відповіді (res) і наступної функції (next).
//   const authHeader = req.get('Authorization'); //отримує заголовок авторизації Autorisation

//   if (!authHeader) {
//     next(createHttpError(401, 'Please provide Authorization header'));
//     return;
//   }

//   //Функція розділяє заголовок авторизації на дві частини: тип заголовку (повинен бути "Bearer") і сам токен.
//   const bearer = authHeader.split(' ')[0];
//   const token = authHeader.split(' ')[1];

//   if (bearer !== 'Bearer' || !token) {
//     next(createHttpError(401, 'Auth header should be of type Bearer'));
//     return;
//   }

//   //Функція шукає сесію в колекції Sessions за наданим токеном доступу.
//   const session = await Session.findOne({
//     accessToken: token,
//   });

//   if (!session) {
//     next(createHttpError(401, 'Session not found')); //Якщо сесію не знайдено, функція викликає помилку з кодом 401 (Сесію не знайдено) і передає її до наступної функції.
//     return;
//   }

//   //Функція перевіряє, чи не минув термін дії токена доступу, порівнюючи поточну дату з датою закінчення дії токена.
//   const isAccessTokenExpired =
//     new Date() > new Date(session.accessTokenValidUntil);
//   if (!isAccessTokenExpired) {
//     next(createHttpError(401, 'Access token expired'));
//     return; //прервать выполнение функции, если токен доступа истек.
//   }

//   //Функція шукає користувача в колекції Users за ідентифікатором користувача, який зберігається в сесії.
//   const user = await User.findById(session.userId);

//   if (!user) {
//     next(createHttpError(401));
//     return;
//   }

//   req.user = user; //Якщо всі перевірки успішні, функція додає об'єкт користувача до запиту (req.user = user).
//   next(); //Викликається наступна функція за допомогою next, що дозволяє продовжити обробку запиту.
// };
