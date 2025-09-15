// Install: npm install axios
const axios = require("axios");
const dotenv=require('dotenv')
dotenv.config()
const ipaddress=process.env.ADDRESS  
const port=process.env.PORT 
const TRACKER = `http://${ipaddress}:7000`;

// Usage: node peer.js <peerId> <port>
const peerId = process.argv[2] || `peer_${Math.floor(Math.random() * 1000)}`;
const portpeer = process.argv[3] || 8000;
const address = `http://${ipaddress}:${portpeer}`;

// Register with tracker
async function register() {
  try {
    await axios.post(`${TRACKER}/register`, { peerId, address });
    console.log(`${peerId} registered with tracker`);
  } catch (e) { console.error("Register failed:", e.message); }
}

// Send heartbeat every 5 seconds
setInterval(async () => {
  try {
    await axios.post(`${TRACKER}/heartbeat`, { peerId });
    // console.log("Heartbeat sent");
  } catch (e) { console.error("Heartbeat failed:", e.message); }
}, 5000);

// Query online peers every 10 seconds
setInterval(async () => {
  try {
    const res = await axios.get(`${TRACKER}/peers`);
    console.log(`Online peers: ${res.data.map(p => p.peerId).join(", ")}`);
  } catch (e) { console.error("Failed to fetch peers:", e.message); }
}, 10000);

// Start
register();
console.log(`${peerId} running on ${address}`);
