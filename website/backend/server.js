import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Load env vars
dotenv.config();

// Route files
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import uploadToCloudinary from "./routes/uploadToCloudinary.js";
import settings from "./routes/settings.js";
import predictions from "./routes/predictions.js";
import { startMlBridge } from "./services/mlBridge.js";
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Body parser middleware
app.use(express.json());

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(limiter);

// Connect to MongoDB
await mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/crumbs_auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));
app.get("/", (req, res) => {
  res.status(200).json({ msg: "backend endpoint", success: true });
});
// Mount routers
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/upload", uploadToCloudinary);
app.use("/api/settings", settings);
app.use("/api/predictions", predictions);

if (process.env.ML_DISABLED !== "true") {
  startMlBridge();
}
// app.get("/test/db", async (req, res) => {
//   const response = await mongoose
//     .connect(process.env.MONGO_URI || "mongodb://localhost:27017/crumbs_auth", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//   return res.json({response})    
// });
// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
