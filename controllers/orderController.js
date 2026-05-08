import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (request, response) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const { userId, items, amount, address } = request.body;
    if (!userId || !items || !amount || !address) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "AED",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "AED",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    });

    response.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Error placing order:", error.message, error.stack);
    response.status(500).json({
      success: false,
      message: "Error processing order",
    });
  }
};

const verifyOrder = async (request, response) => {
  const { orderId, success } = request.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      response.json({
        success: true,
        message: "Paid",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      response.json({
        success: false,
        message: "Not Paid",
      });
    }
    } catch (error) {
    console.log(error);
    response.json({
      success: false,
      message: "Error",
    });
  }
};

const userOrders = async (request, response) => {
  try {
    const orders = await orderModel.find({ userId: request.body.userId });
    response.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    response.json({
      success: false,
      message: "Error",
    });
  }
};

//listing orders for admin panel

const listOrders = async (request, response) => {
  try {
    const orders = await orderModel.find({});
    response.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    response.json({
      success: false,
      message: "Error",
    });
  }
};

//api for updating order Status

const updateStatus = async (request, response) => {
  try {
    await orderModel.findByIdAndUpdate(request.body.orderId, {
      status: request.body.status,
    });
    response.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.log(error);
    response.json({
      success: false,
      message: "Error",
    });
  }
};
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
