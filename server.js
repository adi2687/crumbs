// Install: npm install ws
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
let peers = {}; // { peerId: { socket, lastSeen } }

function broadcastPeerList() {
    const peerList = Object.keys(peers);
    const data = JSON.stringify({ type: "peerList", peers: peerList });
    for (let peerId in peers) {
        peers[peerId].socket.send(data);
    }
}

wss.on("connection", (ws) => {
    let peerId = null;

    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg);

            if (data.type === "register") {
                peerId = data.peerId;
                peers[peerId] = { socket: ws, lastSeen: Date.now() };
                console.log(`${peerId} connected`);
                broadcastPeerList();
            }

            if (data.type === "heartbeat") {
                if (peers[peerId]) peers[peerId].lastSeen = Date.now();
            }
        } catch (e) {
            console.error("Invalid message", e);
        }
    });

    ws.on("close", () => {
        if (peerId && peers[peerId]) {
            delete peers[peerId];
            console.log(`${peerId} disconnected`);
            broadcastPeerList();
        }
    });
});

// Check for inactive peers every 10s
setInterval(() => {
    const now = Date.now();
    for (let id in peers) {
        if (now - peers[id].lastSeen > 15000) { // 15s timeout
            console.log(`${id} timed out`);
            peers[id].socket.close();
            delete peers[id];
        }
    }
    broadcastPeerList();
}, 10000);

console.log("Server running on ws://localhost:8080");
