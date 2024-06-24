import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

import dotenv from 'dotenv';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

dotenv.config();

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR); //create let dir temp
  await createDirIfNotExists(UPLOAD_DIR); //create const dir

  setupServer();
};

bootstrap();

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAY = 30 * 24 * 60 * 60 * 1000;
