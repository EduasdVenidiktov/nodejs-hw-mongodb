import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      return next(createHttpError(401, 'Auth header is not provided!'));
    }

    const [bearer, token] = authHeader.split(' '); //деструктуризовано
    //=======second option=======
    // const bearer = authHeader.split(' ')[0];
    //  const token = authHeader.split(' ')[1];

    //якщо немає bearer або token

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
    const user = await User.findOne(session.userId);
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
