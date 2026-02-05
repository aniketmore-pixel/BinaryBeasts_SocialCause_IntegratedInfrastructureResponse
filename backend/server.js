import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import reportsRoutes from "./routes/reports.js";
dotenv.config();
import infraRoutes from "./routes/infra.js"; // <-- new infra route
import { connectMongo } from "./mongo.js";
import aiRoutes from "./routes/ai.js";
const app = express();
import createContractRoutes from "./routes/contracts.js";

/* ======================
   MIDDLEWARE
====================== */

// Allow frontend to talk to backend
app.use(
  cors({
    origin: "*", // Vite frontend
    credentials: true,
  }),
);

// 🔥 REQUIRED: Parse JSON bodies
app.use(express.json());

// 🔥 REQUIRED: Parse URL-encoded bodies (extra safety)
app.use(express.urlencoded({ extended: true }));

// Parse cookies (JWT / sessions)
app.use(cookieParser());



connectMongo();

/* ======================
   ROUTES
====================== */

// Auth routes
// POST /api/auth/register
// POST /api/auth/login
app.use("/api/contracts", createContractRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/infra", infraRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/ai", aiRoutes);

/* ======================
   HEALTH CHECK
====================== */

app.get("/", (req, res) => {
  res.json({ status: "Server running 🚀" });
});

app.get("/mongo-test", async (req,res)=>{
  res.json({success:true,message:"Mongo working"});
});

/* ======================
   START SERVER
====================== */

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("🔗 SUPABASE_URL loaded:", !!process.env.SUPABASE_URL);
  console.log(
    "🔑 SERVICE ROLE loaded:",
    !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
});
