import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth";
import catRoutes from "./routes/categories";
import prodRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import favoriteRoutes from "./routes/favorites";
import uploadRoutes from "./routes/upload";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Statik dosya sunumu - yüklenen resimler için
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/categories", catRoutes);
app.use("/api/products", prodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorHandler);

export default app;
