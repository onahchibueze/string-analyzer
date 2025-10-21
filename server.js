import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/stringRoute.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/strings", router);
// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
  await connectDB();
  console.log(`✅ Server started at http://0.0.0.0:${PORT}`);
});
