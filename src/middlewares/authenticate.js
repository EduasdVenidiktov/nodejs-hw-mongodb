import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      return next(createHttpError(401, 'Auth header is not provided!'));
    }

    const [bearer, token] = authHeader.split(' ');
    // const bearer = authHeader.split(' ')[0]; //parts[0] -> "Bearer", parts[1] -> "<token>"
    //     // const token = authHeader.split(' ')[1];

    //     //якщо немає bearer або token

    if (bearer !== 'Bearer' || !token) {
      return next(
        createHttpError(401, 'Auth header should be of type Bearer!'),
      );
    }

    //Пошук сесії в колекції Sessions за наданим токеном доступу.
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    //     //Перевірка, чи не минув термін дії токена доступу, порівнюючи поточну дату з датою закінчення дії токена.
    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      return next(createHttpError(401, 'Access token expired'));
    }

    // Пошук користувача в колекції Users за ідентифікатором користувача, який зберігається в сесії.
    const user = await User.findById(session.userId);
    if (!user) {
      return next(createHttpError(401, 'User this session is not found!'));
    }

    // Додаємо користувача до запиту
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authenticate middleware:', error);
    return next(createHttpError(500, 'Internal Server Error'));
  }
};

//==================================================================

// const jsonData = JSON.parse(responseBody);
// pm.environment.set('access_token', jsonData.data.accessToken);
//==============================================================================
// import createHttpError from 'http-errors';
// import { Session } from '../db/models/session.js';
// import { User } from '../db/models/user.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.get('Authorization');

//     if (!authHeader) {
//       return next(createHttpError(401, 'Auth header is not provided!'));
//     }
//     const [bearer, token] = authHeader.split(' '); //деструктуризація

//     // const bearer = authHeader.split(' ')[0]; //parts[0] -> "Bearer", parts[1] -> "<token>"
//     // const token = authHeader.split(' ')[1];

//     //якщо немає bearer або token
//     if (!bearer || !token) {
//       return next(
//         createHttpError(401, 'Auth header should be of type Bearer!'),
//       );
//     }

//     //Пошук сесії в колекції Sessions за наданим токеном доступу.
//     const session = await Session.findOne({ accessToken: token });
//     if (!session) {
//       return next(createHttpError(401, 'Session not found'));
//     }

//     //Перевірка, чи не минув термін дії токена доступу, порівнюючи поточну дату з датою закінчення дії токена.
//     const isAccessTokenExpired =
//       new Date() > new Date(session.accessTokenValidUntil);
//     if (isAccessTokenExpired) {
//       return next(createHttpError(401, 'Access token expired'));
//     }
//     //Функція шукає користувача в колекції Users за ідентифікатором користувача, який зберігається в сесії.
//     const user = await User.findById(session.userId);

//     if (!user) {
//       return next(createHttpError(401, 'User this session is not found!'));
//     }
//     req.user = user;
//     return next();
//   } catch (error) {
//     console.error('Error in authenticate middleware:', error);
//     return next(createHttpError(500, 'Internal Server Error'));
//   }
// };

// //=======================================================
// // конспект
// // import createHttpError from 'http-errors';
// // import { User } from '../db/models/user.js';
// // import { Session } from '../db/models/session.js';

// // //Middleware authenticate виконує процес аутентифікації користувача, перевіряючи наявність та дійсність токена доступу в заголовку запиту
// // export const authenticate = async (req, res, return next) => {
// //   //Функція приймає об'єкти запиту (req), відповіді (res) і наступної функції (return next).
// //   const authHeader = req.get('Authorization'); //отримує заголовок авторизації Autorisation

// //   if (!authHeader) {
// //     return next(createHttpError(401, 'Please provide Authorization header'));
// //     return;
// //   }

// //   //Функція розділяє заголовок авторизації на дві частини: тип заголовку (повинен бути "Bearer") і сам токен.
// //   const bearer = authHeader.split(' ')[0];
// //   const token = authHeader.split(' ')[1];

// //   if (bearer !== 'Bearer' || !token) {
// //     return next(createHttpError(401, 'Auth header should be of type Bearer'));
// //     return;
// //   }

// //   //Функція шукає сесію в колекції Sessions за наданим токеном доступу.
// //   const session = await Session.findOne({
// //     accessToken: token,
// //   });

// //   if (!session) {
// //     return next(createHttpError(401, 'Session not found')); //Якщо сесію не знайдено, функція викликає помилку з кодом 401 (Сесію не знайдено) і передає її до наступної функції.
// //     return;
// //   }

// //   //Функція перевіряє, чи не минув термін дії токена доступу, порівнюючи поточну дату з датою закінчення дії токена.
// //   const isAccessTokenExpired =
// //     new Date() > new Date(session.accessTokenValidUntil);
// //   if (!isAccessTokenExpired) {
// //     next(createHttpError(401, 'Access token expired'));
// //     return; //прервать выполнение функции, если токен доступа истек.
// //   }

// //   //Функція шукає користувача в колекції Users за ідентифікатором користувача, який зберігається в сесії.
// //   const user = await User.findById(session.userId);

// //   if (!user) {
// //     return next(createHttpError(401));
// //     return;
// //   }

// //   req.user = user; //Якщо всі перевірки успішні, функція додає об'єкт користувача до запиту (req.user = user).
// //   return next(); //Викликається наступна функція за допомогою return next, що дозволяє продовжити обробку запиту.
// // };
