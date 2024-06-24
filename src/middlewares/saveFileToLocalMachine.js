import fs from 'node:fs/promises';
import path from 'node:path';
import { ENV_VARS, UPLOAD_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';

export const saveFileToLocalMachine = async (file) => {
  const newPath = path.join(UPLOAD_DIR, file.filename);
  await fs.rename(file.path, newPath);

  return `${env(ENV_VARS.BACKEND_HOST)}/uploads/${file.filename}`;
};

// import fs from 'node:fs/promises';
// import path from 'node:path';
// import { ENV_VARS, UPLOAD_DIR } from '../constants/index.js';
// import { env } from '../utils/env.js';
// // import { env } from 'process'; // Убедитесь, что эта функция есть и используется правильно в вашем проекте

// // export const saveFileToLocalMachine = async (file) => {
// //   const content = await fs.readFile(file.path); //reading file.path? this is a bather
// //   const newPath = path.join(UPLOAD_DIR, file.filename);
// //   await fs.writeFile(newPath, content);
// //   await fs.unlink(file.path); //delete old path

// //   return `${env(ENV_VARS.APP_DOMAIN)}/uploads/${file.filename}`;

// //   // return env(ENV_VARS.BACKEND_HOST) + newPath;

// //   // return `${env('BACKEND_HOST')}/uploads/${path.basename(newPath)}`;
// // };

// export const saveFileToLocalMachine = async (file) => {
//   await fs.rename(
//     path.join(TEMP_UPLOAD_DIR, file.filename),
//     path.join(UPLOAD_DIR, file.filename),
//   );

//   return `${env(ENV_VARS.APP_DOMAIN)}/uploads/${file.filename}`;
// };
