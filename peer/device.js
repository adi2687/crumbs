const os = require('os');
const crypto = require('crypto');

function getMacs() {
  const ifaces = os.networkInterfaces(); 
  const macs = new Set();
  for (const name of Object.keys(ifaces)) { 
    for (const iface of ifaces[name]) {
      if (!iface.internal && iface.mac && iface.mac !== "00:00:00:00:00:00") {
        macs.add(iface.mac);
      }
    }
  }
  return Array.from(macs);
}

function hash(s, salt = 'your-secret-salt') {
  return crypto.createHash('sha256').update(s + salt).digest('hex');
}

// Replace the device ID generation in auth.jsx
const deviceId = `DEV_${hash(getMacs()[0] || 'unknown').substr(0, 9).toUpperCase()}` 
console.log(deviceId)