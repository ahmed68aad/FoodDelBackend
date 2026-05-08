import express from "express";
import cors from "cors";
import { connectdb } from "./config/db.js";
import "dotenv/config";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://food-del-admin-panel-frontend.vercel.app",
  "https://food-del-fontend.vercel.app",
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : []),
];

//middlewars
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

//DB connection
connectdb();

//api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);





app.listen(port, () => console.log(`server started on port ${port}`));
