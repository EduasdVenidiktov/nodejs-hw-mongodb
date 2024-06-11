import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, THIRTY_DAY } from '../index.js';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

export const registerUser = async (payload) => {
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found!'); //не обов'язково 'User not found!'
  }

  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів в payload з user
  if (!isEqual) {
    throw createHttpError(401, 'Password not correct!'); //не обов'язково 'Password not correct!'
  }

  await Session.deleteOne({ userId: user._id }); // видалення попередньої сессії для уникнення конфліктів з новою сессією

  //генеруються нові токени доступу та оновлення
  const accessToken = randomBytes(30).toString('base64'); // забезпечує високу ступінь випадковості, що ускладнює зловмисникам передбачити або згенерувати ті ж самі токени, підвищуючи безпеку системи.
  const refreshToken = randomBytes(30).toString('base64'); //Кодування у Base64 дозволяє легко передавати токени через мережу, оскільки вони складаються тільки з символів, які можна безпечно використовувати у URL і JSON.

  //функція створює нову сесію в базі даних. Нова сесія включає ідентифікатор користувача, згенеровані токени доступу та оновлення, а також часові межі їхньої дії. Токен доступу має обмежений термін дії (наприклад, 15 хвилин), тоді як токен для оновлення діє довше (наприклад, один день).
  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

//Функція createSession генерує нові accessToken і refreshToken, а також встановлює терміни їхньої дії та повертає об'єкт з новими токенами і термінами їхньої дії.
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

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
    //функція refreshUsersSession шукає в колекції SessionsCollection сесію з відповідним sessionId та refreshToken.
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  //Функція перевіряє, чи не минув термін дії refreshToken
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil); //Якщо поточна дата перевищує значення refreshTokenValidUntil, це означає, що токен сесії прострочений.
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  const newSession = createSession(); //Створення нової сесії:

  //Створення та повернення нової сесії в базі даних використовуючи ідентифікатор користувача з існуючої сесії та дані нової сесії, згенеровані функцією createSession.
  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};