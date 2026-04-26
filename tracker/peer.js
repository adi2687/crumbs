import axios from "axios";
import FormData from "form-data";
import fs from "fs";
const SERVER = process.env.TRACKER_URL || "http://localhost:7000";
const peerId = process.env.PEER_ID || "peer-A3F2";
console.log(peerId)
let missedCount = 0;
let lastLatencyMs = 0;

setInterval(async () => {
  const now = new Date();
  const start = Date.now();
  try {
    await axios.post(
      `${SERVER}/heartbeat`,
      {
        peerId,
        missedCount,
        latencyMs: lastLatencyMs,
        day: now.getDay(),
        hour: now.getHours(),
      },
      { timeout: 7000 }
    );
    lastLatencyMs = Date.now() - start;
    missedCount = 0;
  } catch (err) {
    missedCount += 1;
    lastLatencyMs = 7000;
    console.error("Heartbeat failed:", err.message);
  }
}, 5000);

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

async function getOnlinePeers() {
  try {
    const res = await axios.get(`${SERVER}/peers`);
    console.log(`Online peers (${res.data.count}):`, res.data.online);
  } catch (err) {
    console.error("Failed to get online peers:", err.message);
  }
}

(async () => {
  await uploadFile("./logo.png");
  await downloadFile("logo.png", "./logo_copy.png");
  await getOnlinePeers();
})();
