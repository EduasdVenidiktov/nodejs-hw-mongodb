import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

import dotenv from 'dotenv';

dotenv.config();

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAY = 30 * 24 * 60 * 60 * 1000;
