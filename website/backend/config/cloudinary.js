import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load env vars first
dotenv.config();

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  } catch (error) {
    console.log(error);
  }
};

connectCloudinary()
export class Cloudinary {
  
  async uploadImage(image) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        resource_type: "auto",
        folder: "uploads"
      });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
