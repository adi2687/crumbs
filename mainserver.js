// Install: npm install express multer cors
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Multer setup
const upload = multer({ dest: "uploads/" });

// Upload file
app.post("/upload", upload.single("file"), (req, res) => {
  const destPath = `uploads/${req.file.originalname}`;
  if (fs.existsSync(destPath)) {
    fs.renameSync(req.file.path, `uploads/${Date.now()}_${req.file.originalname}`);
  } else {
    fs.renameSync(req.file.path, destPath);
  }
  console.log(`File uploaded: ${req.file.originalname}`);
  res.json({ ok: true, filename: req.file.originalname });
});

// Download file
app.get("/files/:filename", (req, res) => {
  const path = `uploads/${req.params.filename}`;
  if (fs.existsSync(path)) {
    res.download(path);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

app.listen(7000, () => {
  console.log("Server running on http://localhost:7000");
});
