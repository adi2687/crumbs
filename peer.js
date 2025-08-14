const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// File to send (make sure this exists in the same folder)
const FILE_TO_SEND = path.join(__dirname, 'aryan.png');
// File to save when received
const RECEIVED_FILE = path.join(__dirname, 'received.jpg');

// Connect to bootstrap WebSocket server
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log("Connected to bootstrap server");

    // Wait 2 seconds then send file
    setTimeout(() => {
        if (!fs.existsSync(FILE_TO_SEND)) {
            console.error(`File not found: ${FILE_TO_SEND}`);
            return;
        }
        const fileData = fs.readFileSync(FILE_TO_SEND);
        ws.send(fileData); // Send binary data
        console.log(`Sent file: ${FILE_TO_SEND} (${fileData.length} bytes)`);
    }, 2000);
});

// Receive file from another peer
ws.on('message', (data) => {
    fs.writeFileSync(RECEIVED_FILE, data);
    console.log(`Received file saved as: ${RECEIVED_FILE}`);
});

ws.on('close', () => {
    console.log('Disconnected from server');
});
