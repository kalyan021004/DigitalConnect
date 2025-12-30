import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === "application/pdf";

    return {
      folder: "digitalconnect/grievances",
      resource_type: isPDF ? "raw" : "image",
      public_id: `${Date.now()}-${file.originalname}`
    };
  }
});

export const upload = multer({ storage });
