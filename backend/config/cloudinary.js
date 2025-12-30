import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

export const configureCloudinary = () => {
  if (isConfigured) return;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

  console.log("CLOUDINARY CONFIGURED →", {
    cloud: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_KEY ? "SET" : "MISSING",
    secret: process.env.CLOUDINARY_SECRET ? "SET" : "MISSING"
  });

  isConfigured = true;
};

export default cloudinary;
