import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/payment.js";

// Load .env file BEFORE ANYTHING ELSE
dotenv.config();

const app = express();

// ---------------------------------------------
// FIX 1 — Stripe Webhook MUST use raw body
// ---------------------------------------------
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// ---------------------------------------------
// Normal JSON parser for all other endpoints
// ---------------------------------------------
app.use(express.json());

// ---------------------------------------------
// CORS
// ---------------------------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ---------------------------------------------
// ROUTES
// ---------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// ---------------------------------------------
// DATABASE
// ---------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// ---------------------------------------------
// SERVER
// ---------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
