const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const SERVER = "http://localhost:7000";
const peerId = `peer_${Math.floor(Math.random() * 1000)}`;

// Send heartbeat every 5 seconds
setInterval(async () => {
  try {
    await axios.post(`${SERVER}/heartbeat`, { peerId });
  } catch (err) {
    console.error("Heartbeat failed:", err.message);
  }
}, 5000);

// Upload file
async function uploadFile(filePath) {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    const res = await axios.post(`${SERVER}/upload`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity
    });
    console.log("Uploaded:", res.data.filename);
  } catch (err) {
    console.error("Upload failed:", err.message);
  }
}

// Download file
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

// Get online peer count
async function getOnlinePeers() {
  try {
    const res = await axios.get(`${SERVER}/peers`);
    console.log(`Online peers (${res.data.count}):`, res.data.online);
  } catch (err) {
    console.error("Failed to get online peers:", err.message);
  }
}

// Example usage
(async () => {
  await uploadFile("./logo.png");
  await downloadFile("logo.png", "./logo_copy.png");
  await getOnlinePeers();
})();
