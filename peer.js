// Run multiple instances with: node peer.js peer1, node peer.js peer2 ...
// Install: npm install ws
const WebSocket = require("ws");

const peerId = process.argv[2] || "peer_" + Math.floor(Math.random() * 1000);
const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    console.log(`Connected as ${peerId}`);
    ws.send(JSON.stringify({ type: "register", peerId }));

    // Send heartbeat every 5s
    setInterval(() => {
        ws.send(JSON.stringify({ type: "heartbeat" }));
    }, 5000);
});

ws.on("message", (msg) => {
    try {
        const data = JSON.parse(msg);
        if (data.type === "peerList") {
            console.log(`Online peers: ${data.peers.join(", ")}`);
        }
    } catch (e) {
        console.error("Invalid message", e);
    }
});

ws.on("close", () => {
    console.log("Disconnected from server");
});
