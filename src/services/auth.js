import createHttpError from 'http-errors';
import { ContactsCollection, SessionsCollection } from '../db/Contact';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, ONE_DAY, THIRTY_DAY } from '..';

export const registerUser = async (payload) => {
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await ContactsCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};
export const loginUser = async (payload) => {
  const user = await ContactsCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів
  if (!isEqual) {
    throw createHttpError(404);
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64'); // забезпечує високу ступінь випадковості, що ускладнює зловмисникам передбачити або згенерувати ті ж самі токени, підвищуючи безпеку системи.
  const refreshToken = randomBytes(30).toString('base64'); //Кодування у Base64 дозволяє легко передавати токени через мережу, оскільки вони складаються тільки з символів, які можна безпечно використовувати у URL і JSON.

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
};
