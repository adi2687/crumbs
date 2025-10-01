const os = require("os");

function getMac() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (!iface.internal && iface.mac && iface.mac !== "00:00:00:00:00:00") {
        return { name, mac: iface.mac };
      }
    }
  }
}

console.log(getMac());
