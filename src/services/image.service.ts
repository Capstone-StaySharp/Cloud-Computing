import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Define custom storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be stored in 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Define file filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB file size limit
  }
});

export const uploadSingleImage = upload.single('image');

export const getFileInfo = (file: Express.Multer.File) => {
  return {
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path
  };
};

export const processBatchImages = () => {
  fs.mkdirSync("processed-images", { recursive: true });

  const files = fs.readdirSync("uploads");

  files.forEach((file) => {
    fs.renameSync(`uploads/${file}`, `processed-images/${file}`);
  })

  return files.length;
};
