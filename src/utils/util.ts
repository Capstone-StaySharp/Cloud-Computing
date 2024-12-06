import { Application } from "express";
import { BATCH_PROCESS_LIMIT } from "../index";

export const updateImageUploadCounter = (app: Application) => {
  app.locals.uploadedImageCounter++;

  if (app.locals.uploadedImageCounter > BATCH_PROCESS_LIMIT) {
    app.locals.uploadedImageCounter = 1;
  }

  return app.locals.uploadedImageCounter;
};
