// node >= 14
const os = require('os');
const https = require('https');

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

// Optional: hash the MACs (sha256) before sending
const crypto = require('crypto');
function hash(s, salt = 'your-secret-salt') {
  return crypto.createHash('sha256').update(s + salt).digest('hex');
}

async function report(serverUrl, apiKey) {
  const macs = getMacs();
  const payload = {
    macs: macs.map(m => hash(m)), // send hashed MACs instead of raw
    hostname: os.hostname(),
    timestamp: Date.now()
  };

  const body = JSON.stringify(payload);
  const url = new URL(serverUrl);

  const req = https.request({
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'Authorization': `Bearer ${apiKey}`
    }
  }, res => {
    console.log('Server responded with status', res.statusCode);
  });

  req.on('error', (err) => console.error('Request error', err));
  req.write(body);
  req.end();
}

// usage: node agent.js https://example.com/collect YOUR_API_KEY
if (require.main === module) {
  const [ , , serverUrl, apiKey ] = process.argv;
  if (!serverUrl || !apiKey) {
    console.error('Usage: node agent.js <serverUrl> <apiKey>');
    process.exit(1);
  }
  report(serverUrl, apiKey);
}
