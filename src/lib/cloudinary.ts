import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();

// Configure cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getPhotoUrl(bufferFile: any) {
  try {
    // Convert buffer to data URL
    const dataUrl = `data:image/png;base64,${bufferFile.toString("base64")}`;

    let photoUrl = null;
    photoUrl = await cloudinary.uploader.upload(dataUrl, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      folder: process.env.CLOUDINARY_FOLDER,
    });

    return photoUrl.secure_url;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
