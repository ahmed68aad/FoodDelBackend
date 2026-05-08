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
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
};

//middlewars
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

//DB connection
connectdb();

//api endpoints
app.get("/", (request, response) => {
  response.json({ success: true, message: "Food delivery API is running" });
});

app.get("/api/health", (request, response) => {
  response.json({ success: true, status: "ok" });
});

app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);





app.listen(port, () => console.log(`server started on port ${port}`));
