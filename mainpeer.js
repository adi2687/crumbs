// Install: npm install axios form-data fs
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const SERVER = "http://localhost:7000"; // Your server URL

// Upload file to server
async function uploadFile(filePath) {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const res = await axios.post(`${SERVER}/upload`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    console.log("Uploaded:", res.data.filename);
  } catch (err) {
    console.error("Upload failed:", err.message);
  }
}

// Download file from server
async function downloadFile(filename, savePath) {
  try {
    const res = await axios.get(`${SERVER}/files/${filename}`, { responseType: "stream" });
    const writer = fs.createWriteStream(savePath);
    res.data.pipe(writer);
    writer.on("finish", () => console.log("Downloaded:", savePath));
  } catch (err) {
    console.error("Download failed:", err.message);
  }
}

// Example usage
(async () => {
  await uploadFile("./logo.png");          // Upload
  await downloadFile("logo.png", "./downloaded_logo.png"); // Download
})();
