import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, THIRTY_DAY } from '../index.js';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import { ENV_VARS } from '../constants/index.js';
import { env } from '../utils/env.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { validateGoogleOAuthCode } from '../utils/googleOAuth2.js';

export const registerUser = async (payload) => {
  const encryptedPassword = await bcrypt.hash(payload.password, 10); //число 10 - це "salt rounds", також "cost factor". Визначає кількість операцій хешировання, котрі будуть виконані. Це впливає на складність та час, необходідні для генерації хеша пароля.

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'User not found!'); //не обов'язково 'User not found!'
  }

  const isEqual = await bcrypt.compare(password, user.password); // Порівнюємо хеші паролів в payload з user
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized!'); //не обов'язково 'Password not correct!'
  }

  await Session.deleteOne({ userId: user._id }); // видалення попередньої сессії для уникнення конфліктів з новою сессією

  //сессія, генеруються нові токени доступу та оновлення
  const accessToken = crypto.randomBytes(30).toString('base64'); // забезпечує високу ступінь випадковості, що ускладнює зловмисникам передбачити або згенерувати ті ж самі токени, підвищуючи безпеку системи.
  const refreshToken = crypto.randomBytes(30).toString('base64'); //Кодування у Base64 дозволяє легко передавати токени через мережу, оскільки вони складаються тільки з символів, які можна безпечно використовувати у URL і JSON.

  //функція створює нову сесію в базі даних. Нова сесія включає ідентифікатор користувача, згенеровані токени доступу та оновлення, а також часові межі їхньої дії. Токен доступу має обмежений термін дії (наприклад, 15 хвилин), тоді як токен для оновлення діє довше (наприклад, один день).
  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
};

export const logoutUser = async (sessionId, refreshToken) => {
  await Session.deleteOne({ _id: sessionId, refreshToken: refreshToken });
};

//Функція createSession генерує нові accessToken і refreshToken, а також встановлює терміни їхньої дії та повертає об'єкт з новими токенами і термінами їхньої дії.
const createSession = () => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  };
};

//функція refreshUsersSession обробляє запит на оновлення сесії користувача, перевіряє наявність і термін дії існуючої сесії, генерує нову сесію та зберігає її в базі даних.
//refreshUsersSession виконує процес оновлення сесії і повертає об'єкт нової сесії.
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    //Перевірка refreshUsersSession шукає в колекції SessionsCollection сесію з відповідним sessionId та refreshToken.
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  //Перевірка, чи не минув термін дії refreshToken
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil); //Якщо поточна дата перевищує значення refreshTokenValidUntil, це означає, що токен сесії прострочений.
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  const newSession = createSession(); //Створення нової сесії:
  await Session.deleteOne({ _id: sessionId, refreshToken });

  //Перевірка: чи є такий user в БД
  const user = await User.findOne(session.userId);
  if (!user) {
    throw createHttpError(401, 'User is not in data!');
  }

  //Створення та повернення нової сесії в базі даних використовуючи ідентифікатор користувача з існуючої сесії та дані нової сесії, згенеровані функцією createSession.
  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};

export const sendResetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );
  const templateSource = await fs.readFile(
    path.join('src', 'templates', 'reset-password-email.html'),
  );

  const template = handlebars.compile(templateSource.toString());

  const html = template({
    name: user.name,
    link: `${env(ENV_VARS.APP_DOMAIN)}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(ENV_VARS.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);

    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let tokenPayload;
  try {
    tokenPayload = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findById(tokenPayload.sub);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(
    {
      _id: tokenPayload.sub,
      email: tokenPayload.email,
    },
    { password: hashedPassword },
  );

  await Session.deleteMany({ userId: user._id }); //видалення поточної сесії
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateGoogleOAuthCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) throw createHttpError(401);

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const password = bcrypt.hash(crypto.randomBytes(30).toString('base64'));
    user = await User.create({
      name: payload.given_name + ' ' + payload.family_name,
      email: payload.email,
      password,
    });
  }

  await Session.deleteOne({
    userId: user._id,
  });

  const newSession = createSession();

  return await Session.create({
    userId: user._id,
    ...newSession,
  });
};
