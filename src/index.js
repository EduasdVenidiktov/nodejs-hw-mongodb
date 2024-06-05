import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
