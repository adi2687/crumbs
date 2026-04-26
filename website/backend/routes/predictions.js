import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getStatus } from "../services/mlBridge.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRED_FILE = path.resolve(__dirname, "..", "..", "..", "ml", "logs", "predictions.json");

const router = express.Router();

router.get("/", async (req, res) => {
  const status = getStatus();
  try {
    const content = await fs.readFile(PRED_FILE, "utf8");
    const predictions = JSON.parse(content);
    res.json({ success: true, predictions, ...status });
  } catch (err) {
    res.status(503).json({
      success: false,
      message: `predictions unavailable: ${err.code || err.message}`,
      predictions: {},
      ...status,
    });
  }
});

export default router;
