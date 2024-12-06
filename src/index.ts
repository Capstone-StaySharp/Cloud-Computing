import express from "express";
import dotenv from "dotenv";
import { getFileInfo, processBatchImages } from "./services/image.service";
import { uploadSingleImage } from "./services/image.service";
import { updateImageUploadCounter } from "./utils/util";

dotenv.config();

const app = express();

app.locals.uploadedImageCounter = 0;
export const BATCH_PROCESS_LIMIT = 5;

const NODE_ENV = process.env.NODE_ENV || "dev";
const APP_PORT = Number(process.env.APP_PORT) || 3000;
const HOST = NODE_ENV === "prod" ? "0.0.0.0" : "localhost";

app.get("/", (req, res) => {
  res.send(`Hello from image upload`);
});

app.post("/upload-image", uploadSingleImage, (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "No image provided",
      });
      return;
    }

    const fileInfo = getFileInfo(req.file);
    const totalUploads = updateImageUploadCounter(app);

    if (totalUploads === BATCH_PROCESS_LIMIT) {
      // TODO: Process the batch of images
      const processedImagesCount = processBatchImages();

      res.json({
        message: "Batch of images processed successfully",
        processedImagesCount,
      });
    }

    res.json({
      message: "Image uploaded successfully",
      fileInfo,
      totalUploads,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(APP_PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${APP_PORT}`);
});
