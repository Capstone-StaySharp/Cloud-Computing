import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import FormData from "form-data";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// Define custom storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be stored in 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Define file filter to allow only images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG files are allowed."));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB file size limit
  },
});

export const uploadSingleImage = upload.single("image");

export const getFileInfo = (file: Express.Multer.File) => {
  return {
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
  };
};

export const processBatchImages = async () => {
  try {
    // Step 1: Create a tmp directory
    fs.mkdirSync("tmp", { recursive: true });

    // Step 2: Move all images from uploads to tmp
    const files = fs
      .readdirSync("uploads")
      .filter((file) =>
        [".jpg", ".png", ".gif", ".jpeg"].includes(path.extname(file))
      );

    files.forEach((file) => {
      fs.renameSync(path.join("uploads", file), path.join("tmp", file));
    });

    // Step 3: Send tmp directory to the BASE_URL/process endpoint
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(
        "folder",
        fs.createReadStream(path.join("tmp", file)),
        file
      );
    });

    const response = await axios.post(
      `${process.env.BASE_URL}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Step 4: Delete tmp directory
    fs.rmSync("tmp", { recursive: true, force: true });

    // Step 5: Return number of images processed
    console.log(response.data);
    return files.length;
  } catch (error) {
    console.error("Image processing error:", error);
    // Clean up tmp directory in case of error
    if (fs.existsSync("tmp")) {
      fs.rmSync("tmp", { recursive: true, force: true });
    }
    throw error;
  }
};
