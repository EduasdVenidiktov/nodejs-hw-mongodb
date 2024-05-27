import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js'; // Переконайтеся, що цей шлях правильний
import { getAllContacts, getContactById } from './services/contacts.js';

// const PORT = Number(env('PORT', '3000'));
const PORT = process.env.PORT || Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts(); // Реєстрація роута для отримання всіх контактів

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId); // Реєстрація роута для отримання контакту за ID

    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: 'Not found',
      data: null,
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      data: null,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};
