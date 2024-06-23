import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR); // directory for file uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

export const upload = multer({ storage });

// export const checkphoto = (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'photo is required' });
//   }
//   next();
// };