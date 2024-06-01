import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import routerContacts from './routers/contacts.js';
import createHttpError from 'http-errors';

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
  // Додаємо роутер до app як middleware
  app.use(routerContacts);

  // Обробка помилок сервера
  const errorHandler = (err, req, res, next) => {
    // Перевірка, чи отримали ми помилку від createHttpError (http://localhost:3000/contacts/777)
    if (err instanceof createHttpError.HttpError) {
      res.status(err.status).json({
        status: err.status,
        message: err.message,
        data: { message: 'Contact not found' },
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

  // Применяем middleware для обработки ошибок

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};
//===============================================================================
// import express from 'express';
// import pino from 'pino-http';
// import cors from 'cors';
// import { env } from './utils/env.js';
// import routerContacts from './routers/contacts.js';
// import createHttpError from 'http-errors';

// // const PORT = Number(env('PORT', '3000'));
// const PORT = process.env.PORT || Number(env('PORT', '3000'));

// export const setupServer = () => {
//   const app = express();
//   app.use(express.json());

//   app.use(cors());

//   app.use(
//     pino({
//       transport: {
//         target: 'pino-pretty',
//       },
//     }),
//   );
//   // Додаємо роутер до app як middleware
//   app.use(routerContacts);

//   //Обробка неіснуючих маршрутів
//   // app.use('*', (req, res, next) => {
//   //   res.status(404).json({
//   //     status: 404,
//   //     message: 'Not found',
//   //   });
//   // });

//   // // Обробка неіснуючих маршрутів http://localhost:3000/cont7777acts/
//   // //localhost:3000/
//   // http: app.use('*', (req, res, next) => {
//   //   next(createHttpError(404, 'Route not found'));
//   // });

//   // Обробка помилок сервера
//   const errorHandler = (err, req, res, next) => {
//     // Перевірка, чи отримали ми помилку від createHttpError (http://localhost:3000/contacts/777)
//     if (err instanceof createHttpError.HttpError) {
//       res.status(err.status).json({
//         status: err.status,
//         message: err.name,
//         data: err,
//         // data: err.expose ? err.message : {},
//       });
//       return;
//     }
//     //http://localhost:3000/contacts/enenvekj
//     res.status(500).json({
//       // status: 'error',
//       message: 'Something went wrong',
//       data: err.message,
//     });
//   };

//   // Обробка неіснуючих маршрутів http://localhost:3000/cont7777acts/
//   //localhost:3000/
//   const notFoundHandler = (req, res, next) => {
//     res.status(404).json({
//       message: 'Route not found',
//     });
//   };

//   // Применяем middleware для обработки ошибок

//   app.use('*', notFoundHandler);
//   app.use(errorHandler);

//   app.listen(PORT, () => {
//     console.log(`Server is running on port: ${PORT}`);
//   });
// };
//========================================================================
// app.use(express.json());
// app.use(cors());

// app.use(
//   pino({
//     transport: {
//       target: 'pino-pretty',
//     },
//   }),
// );
// // Додаємо роутер до app як middleware
// app.use(router);

// // Обробка неіснуючих маршрутів
// app.use('*', (req, res, next) => {
//   res.status(404).json({
//     status: 404,
//     message: 'Not found',
//   });
// });

// Обробка помилок сервера
// app.use((err, req, res, next) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Something went wrong',
//     data: null,
//   });
// });

//   app.listen(PORT, () => {
//     console.log(`Server is running on port: ${PORT}`);
//   });
// };
