import createHttpError from 'http-errors';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';
import { THIRTY_DAY } from '../index.js';
import { User } from '../db/models/user.js';

export const registerUserController = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Перевірка на існування користувача з таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(409, 'Email in use'));
    }
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// export const loginUserController = async (req, res, next) => {
//   try {
//     await loginUser(req.body); //Вона викликає функцію loginUser, передаючи їй тіло запиту (req.body), яке містить дані для входу (email та пароль).

//     //// Убедитесь, что session содержит refreshToken, _id и accessToken
//     if (
//       !session ||
//       !session.refreshToken ||
//       !session._id ||
//       !session.accessToken
//     ) {
//       throw new Error('Invalid session data');
//     }
//     //Функція встановлює два куки: refreshToken і sessionId, використовуючи метод res.cookie.
//     res.cookie('refreshToken', session.refreshToken, {
//       httpOnly: true,
//       expires: new Date(Date.now() + THIRTY_DAY),
//     }); //refreshToken доступний тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Він має термін дії тридцять днів

//     res.cookie('sessionId', session._id, {
//       httpOnly: true,
//       expires: new Date(Date.now() + THIRTY_DAY),
//     }); //теж саме і sessionId

//     //метод res.json для відправлення відповіді клієнту.
//     res.status(200).json({
//       //можливо видалити status(200).
//       status: 200,
//       message: 'Successfully logged in an user!',
//       data: { accessToken: session.accessToken },
//       // {accessToken: session.accessToken}, //перевірити
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//logoutUserController виконує процес обробки запиту на вихід користувача і взаємодію з клієнтом через HTTP

export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    //перевірка чи session містить refreshToken, _id та accessToken
    if (
      !session ||
      !session.refreshToken ||
      !session._id ||
      !session.accessToken
    ) {
      throw new Error('Invalid session data');
    }

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAY),
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAY),
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    //перевіряє, чи існує кукі sessionId у запиті.
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId); //Якщо sessionId присутній, функція викликає logoutUser, передаючи їй значення sessionId. Це дозволяє видалити сесію користувача з бази даних або здійснити інші необхідні дії для виходу користувача.

      //Функція очищає кукі sessionId і refreshToken, використовуючи метод res.clearCookie. Це видаляє відповідні куки з браузера клієнта, що забезпечує вихід користувача з системи на стороні клієнта.
      res.clearCookie('sessionId');
      res.clearCookie('refreshToken');
      res.status(204).send(); //Функція відправляє відповідь клієнту зі статусним кодом 204 (No Content). Це означає, що запит був успішно оброблений, але у відповіді немає тіла повідомлення.
    }
  } catch (error) {
    next(error);
  }
};

//Установка сессії
//setupSession встановлює два куки: refreshToken і sessionId, використовуючи метод res.cookie.

const setupSession = (res, session) => {
  res.cooke('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  }); //refreshToken зберігається як http-only cookie, що означає, що він доступний тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Він має термін дії 30 днів.

  res.cookie('sessionId', session._Id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
}; //також, як і refreshToken

//оновлення сесії користувача і взаємодію з клієнтом через HTTP.
export const refreshUserSessionController = async (req, res, next) => {
  try {
    //викликає функцію refreshUsersSession, передаючи їй об'єкт з sessionId та refreshToken, отримані з куків запиту (req.cookies.sessionId та req.cookies.refreshToken).
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session); //функція викликає setupSession, передаючи їй об'єкт відповіді (res) та нову сесію.
    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

//=====================================================================

// import createHttpError from 'http-errors';
// import {
//   loginUser,
//   logoutUser,
//   refreshUsersSession,
//   registerUser,
// } from '../services/auth.js';
// import { THIRTY_DAY } from '../index.js';
// import { User } from '../db/models/user.js';

// export const registerUserController = async (req, res) => {
//   const user = await registerUser(req.body);

//   // if (email) return next(createHttpError(409, 'Email in use'));
//   // Проверка на существование пользователя с таким email
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return next(createHttpError(409, 'Email in use'));
//   }

//   res.status(201).json({
//     status: 201,
//     message: 'Successfully registered a user!',
//     data: user,
//   });
// };

// export const loginUserController = async (req, res) => {
//   const session = await loginUser(req.body); //Вона викликає функцію loginUser, передаючи їй тіло запиту (req.body), яке містить дані для входу (email та пароль).

//   //Функція встановлює два куки: refreshToken і sessionId, використовуючи метод res.cookie.
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + THIRTY_DAY),
//   }); //refreshToken доступний тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Він має термін дії тридцять днів

//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + THIRTY_DAY),
//   }); //теж саме і sessionId

//   // if (email) return next(createHttpError(401));
//   //метод res.json для відправлення відповіді клієнту.
//   res.status(200).json({
//     //можливо видалити status(200).
//     status: 200,
//     message: 'Successfully logged in an user!',
//     data: { accessToken },
//     // {accessToken: session.accessToken}, //перевірити
//   });
// };

// //logoutUserController виконує процес обробки запиту на вихід користувача і взаємодію з клієнтом через HTTP
// export const logoutUserController = async (req, res) => {
//   //перевіряє, чи існує кукі sessionId у запиті.
//   if (req.cookies.sessionId) {
//     await logoutUser(req.cookies.sessionId); //Якщо sessionId присутній, функція викликає logoutUser, передаючи їй значення sessionId. Це дозволяє видалити сесію користувача з бази даних або здійснити інші необхідні дії для виходу користувача.
//   }

//   //Функція очищає кукі sessionId і refreshToken, використовуючи метод res.clearCookie. Це видаляє відповідні куки з браузера клієнта, що забезпечує вихід користувача з системи на стороні клієнта.
//   res.clearCookie('sessionId');
//   res.clearCookie('refreshToken');
//   res.status(204).send(); //Функція відправляє відповідь клієнту зі статусним кодом 204 (No Content). Це означає, що запит був успішно оброблений, але у відповіді немає тіла повідомлення.
// };

// //setupSession встановлює два куки: refreshToken і sessionId, використовуючи метод res.cookie.
// const setupSession = (res, session) => {
//   res.cooke('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + THIRTY_DAY),
//   }); //refreshToken зберігається як http-only cookie, що означає, що він доступний тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Він має термін дії 30 днів.

//   res.cookie('sessionId', session._Id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + THIRTY_DAY),
//   });
// }; //також, як і refreshToken

// //оновлення сесії користувача і взаємодію з клієнтом через HTTP.
// export const refreshUserSessionController = async (req, res) => {
//   //викликає функцію refreshUsersSession, передаючи їй об'єкт з sessionId та refreshToken, отримані з куків запиту (req.cookies.sessionId та req.cookies.refreshToken).
//   const session = await refreshUsersSession({
//     sessionId: req.cookies.sessionId,
//     refreshToken: req.cookies.refreshToken,
//   });

//   setupSession(res, session); //функція викликає setupSession, передаючи їй об'єкт відповіді (res) та нову сесію.
//   res.json({
//     status: 200,
//     message: 'Successfully refreshed a session!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };
