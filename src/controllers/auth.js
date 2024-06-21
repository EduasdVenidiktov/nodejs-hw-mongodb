import createHttpError from 'http-errors';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  resetPassword,
  sendResetPassword,
} from '../services/auth.js';
import { THIRTY_DAY } from '../index.js';
import { User } from '../db/models/user.js';

export const registerUserController = async (req, res, next) => {
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
  next(error); //передає помилку 409 при повторній реєстрації одного і того ж e-mail
};

export const loginUserController = async (req, res) => {
  // const user = await loginUser(req.body);
  const session = await loginUser(req.body); // викликаємо функцію loginUser, передаючи їй тіло запиту (req.body), яке містить дані для входу (email та пароль).

  //Функція встановлює два куки: refreshToken і sessionId, використовуючи метод res.cookie.
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY), //expires термін дії, з expire теж працює
  }); //refreshToken доступний тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Він має термін дії тридцять днів

  //session._id унікальний ідентифікатор сессії
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  }); //теж саме і sessionId

  //метод res.json для відправлення відповіді клієнту.
  res.json({
    status: 200,
    message: 'Contact is loged in',
    // data: { user },
    data: { accessToken: session.accessToken }, // token ждя клієнта, front-end
  });
};

export const logoutUserController = async (req, res) => {
  //перевіряє, чи існує кукі sessionId у запиті.
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId); //Якщо sessionId присутній, функція викликає logoutUser, передаючи їй значення sessionId. Це дозволяє видалити сесію користувача з бази даних або здійснити інші необхідні дії для виходу користувача.

    //Функція очищає кукі sessionId і refreshToken, використовуючи метод res.clearCookie. Це видаляє відповідні куки з браузера клієнта, що забезпечує вихід користувача з системи на стороні клієнта.
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).send(); //Функція відправляє відповідь клієнту зі статусним кодом 204 (No Content). Це означає, що запит був успішно оброблений, але у відповіді немає тіла повідомлення.
  } else {
    res.status(401).send(); // Відповідь з кодом 204 навіть якщо немає sessionId
  }
};

//====================================================================================
//Установка сессії
//setupSession встановлює два куки: refreshToken і sessionId, використовуючи метод res.cookie.

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  }); //refreshToken зберігається як http-only cookie, що означає, що він доступний тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Він має термін дії 30 днів.

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
}; //також, як і refreshToken

//оновлення сесії користувача і взаємодію з клієнтом через HTTP.
export const refreshUserSessionController = async (req, res) => {
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
};

//====requestResetEmailController====
export const sendResetPasswordEmailController = async (req, res) => {
  await sendResetPassword(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
