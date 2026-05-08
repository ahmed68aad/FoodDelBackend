import express from "express";
import {
  addItemsToCart,
  removeItemsFromCart,
  getCart,
} from "../controllers/cartController.js";
import authMiddlewar from "../middleWare/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddlewar, addItemsToCart);
cartRouter.post("/remove", authMiddlewar, removeItemsFromCart);
cartRouter.post("/get", authMiddlewar, getCart);

export default cartRouter;
