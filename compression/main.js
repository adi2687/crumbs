// compress.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/**
 * Compress an image
 * @param {string} inputPath Path to input image
 * @param {string} outputPath Path to save compressed image
 * @param {number} quality Quality level (1-100)
 */
async function compressImage(inputPath, outputPath, quality = 70) {
  const ext = path.extname(inputPath).toLowerCase();

  let image = sharp(inputPath);

  if (ext === ".jpg" || ext === ".jpeg") {
    image = image.jpeg({ quality, mozjpeg: true });
  } else if (ext === ".png") {
    image = image.png({ quality });
  } else if (ext === ".webp") {
    image = image.webp({ quality });
  } else {
    throw new Error("Unsupported format: " + ext);
  }

  await image.toFile(outputPath);
  console.log(`Compressed image saved: ${outputPath}`);
}

// Example usage
(async () => {
  const input = "../aryan.png"; // your image file
  const output = "compressed.jpg";
  await compressImage(input, output, 70); // quality 70%
})();
