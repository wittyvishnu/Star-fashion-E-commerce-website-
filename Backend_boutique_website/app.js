import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectmongoDb from "./utiles/db/mongoDb.js";
import addressRoutes from './routes/addressRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import refundRoutes from './routes/refundRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import productRoutes from './routes/productRoutes.js';
import rateLimitMiddleware from "./middlewares/rateLimitMiddleware.js";
import categoryRoutes from './routes/categoryRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import feedbackRoutes from "./routes/feedbackRoutes.js";
import "./cron/restoreReservedStock.js";
import { razorpayWebhook } from "./webhooks/paymentWebhooks.js";

dotenv.config();

// MongoDB connection
connectmongoDb();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

console.log("CORS_ORIGINS:", allowedOrigins);

const corsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : false, // set CORS_ORIGINS env (comma-separated)
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Razorpay webhook: allow all origins and keep raw body for signature verification
app.post(
  "/api/webhook/razorpay",
  cors({ origin: "*" }),
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', rateLimitMiddleware(15 * 60 * 1000, 10),userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/products', productRoutes);
app.use('/api/otp',otpRoutes); 
app.use("/api/feedback", feedbackRoutes);
app.use("/api/refund", refundRoutes);
// (Webhook is registered above with raw body & open CORS)


// Handle invalid routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "Invalid route" });
});

app.listen(PORT, () => console.log(`Server running at PORT:${PORT}`));