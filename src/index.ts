import express from "express";
import dotenv from "dotenv";
import { processBatchImages } from "./services/image.service";
import { uploadSingleImage } from "./services/image.service";
import { updateImageUploadCounter } from "./utils/util";
import { triggerModel } from "./utils/trigger-model";
import { TModelSuccesResponse } from "./utils/type";

dotenv.config();

const app = express();

app.locals.uploadedImageCounter = 0;

export const BATCH_PROCESS_LIMIT = Number(process.env.BATCH_PROCESS_LIMIT) || 24;
const NODE_ENV = process.env.NODE_ENV || "dev";
const APP_PORT = Number(process.env.APP_PORT) || 3000;
const HOST = NODE_ENV === "prod" ? "0.0.0.0" : "localhost";

app.get("/", (req, res) => {
  res.send(`Hello from image upload`);
});

app.post("/upload-image", uploadSingleImage, async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "No image provided",
      });
      return;
    }

    const totalUploads = updateImageUploadCounter(app);

    if (totalUploads === BATCH_PROCESS_LIMIT) {
      const processedImagesCount = await processBatchImages();

      if (!processedImagesCount) {
        res.status(500).json({
          message: "Failed to process images",
        });
        return;
      }

      const result = await triggerModel();

      if (result.status !== 200 && result.status !== 201) {
        res.status(500).json({
          message: "Failed to trigger model",
        });
        return;
      }

      const modelResult: TModelSuccesResponse = result.data;

      const { both_eye_closed, yawn } = modelResult;

      res.json({
        success: true,
        message: "Processing completed",
        is_model_triggered: true,
        data: {
          is_both_eyes_closed: both_eye_closed,
          is_yawning: yawn,
        },
      });
      return;
    }

    res.json({
      success: true,
      is_model_triggered: false,
      message: "Image uploaded successfully",
      total_image_for_processing: BATCH_PROCESS_LIMIT,
      total_image_uploaded: totalUploads,
      remaining_image_for_processing: BATCH_PROCESS_LIMIT - totalUploads,
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
