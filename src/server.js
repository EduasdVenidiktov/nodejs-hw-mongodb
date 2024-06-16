import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import createHttpError from 'http-errors';
import mainRouter from './routers/index.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cookieParser());
  app.use(mainRouter);

  // Додаємо роутери до app як middleware
  app.use(contactsRouter);

  // Обробка помилок сервера
  const errorHandler = (err, req, res, next) => {
    // Перевірка, чи отримали ми помилку від createHttpError (http://localhost:3000/contacts/777)
    if (err instanceof createHttpError.HttpError) {
      res.status(err.status).json({
        status: err.status,
        message: err.message,
        ...(err.errors && { data: { errors: err.errors } }), // Відображення повідомлень про помилки тільки якщо є помилки
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'Something went wrong',
      });
    }
  };

  // Обробка неіснуючих маршрутів http://localhost:3000/cont7777acts/
  //localhost:3000/
  const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      status: 404,
      message: 'Route not found',
    });
  };

  //Застосвуємо middleware для обробки помилок
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};
