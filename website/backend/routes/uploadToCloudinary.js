import { Cloudinary } from "../config/cloudinary.js";
import express from "express";

const router = express.Router();

router.post("/uploadImage", async (req, res) => {
  try { 
    console.log("Request received");
    console.log("Body:", req.body);
    
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image data provided"
      });
    }

    // Upload to Cloudinary using instance method
    const cloudinaryInstance = new Cloudinary();
    const result = await cloudinaryInstance.uploadImage(image);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image"
      });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        size: result.bytes
      }
    });

  } catch (error) {
    console.error("Image upload to Cloudinary failed:", error);
    res.status(500).json({
      success: false,
      message: "Server error during upload"
    });
  }
});

export default router;
