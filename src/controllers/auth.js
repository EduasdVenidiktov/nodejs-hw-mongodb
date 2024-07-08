import createHttpError from 'http-errors';
import {
  loginOrSignupWithGoogle,
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  resetPassword,
  sendResetPassword,
} from '../services/auth.js';
import { THIRTY_DAY } from '../index.js';
import { User } from '../db/models/user.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { validateGoogleOAuthSchema } from '../validation/validateGoogleOAuth.js';

export const registerUserController = async (req, res, next) => {
  const { email } = req.body;
  // for the existence of a user with this email
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
  next(error); //Returns a 409 error for duplicate registration with the same email
};

export const loginUserController = async (req, res) => {
  // const user = await loginUser(req.body);
  const session = await loginUser(req.body); // Call the loginUser function, passing it the request body (req.body), which contains the login data (email and password).

  //The function sets two cookies: refreshToken and sessionId, using the res.cookie method.
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY), //expires is the expiration term, but expire also works.
  }); //The refreshToken is accessible only through HTTP requests and cannot be accessed via client-side JavaScript. It has a thirty-day expiration.

  //session._id unique session identifier
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  }); //the same applies to sessionId

  //the res.json method is used to send a response to the client
  res.json({
    status: 200,
    message: 'Contact is loged in',
    // data: { user },
    data: { accessToken: session.accessToken }, // token for the client, front-end
  });
};

export const logoutUserController = async (req, res) => {
  //check, is there a cookie named sessionId in the request.
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId); //If 'sessionId' is present, the function calls 'logoutUser', passing sessionId as a parameter. This allows for deleting the user session from the database or performing other necessary logout actions.

    //The function clears the cookies 'sessionId' and 'refreshToken' using the 'res.clearCookie' method. This removes the respective cookies from the client's browser, facilitating user logout from the client side.
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).send(); //The function sends a response to the client with a status code 204 (No Content). This indicates that the request was successfully processed, but there is no message body in the response.
  } else {
    res.status(401).send(); // Responds with status code 204 even if there is no sessionId.
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

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const verifyGoogleOAuthController = async (req, res) => {
  const { code } = req.body;
  await validateGoogleOAuthSchema.validateAsync({ code });

  const session = await loginOrSignupWithGoogle(code);
  await validateGoogleOAuthSchema.validateAsync({ code });

  setupSession(res, session); //функція викликає setupSession, передаючи їй об'єкт відповіді (res) та нову сесію.
  res.json({
    status: 200,
    message: 'Logged in this Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
