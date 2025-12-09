import Product from '../models/productModel.js';
import { cloudinary } from '../utiles/cloudinary.js';
import Category from '../models/categoryModel.js';
import Cart from '../models/cartModel.js';
import Refund from "../models/refundModel.js";
import Order from "../models/orderModel.js";
import ReservedOrder from "../models/reservedOrderModel.js";
import crypto from "crypto";

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    console.log("🔐 Razorpay Webhook Secret:", secret);

    // 🔐 Validate signature
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).json({ success: false });
    }

    const event = req.body.event;
    console.log("🔔 Razorpay Webhook Event:", event);

    // =======================================================
    //   1️⃣ PAYMENT CAPTURED → Create final order
    // =======================================================
    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;

      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      console.log("✔ PAYMENT CAPTURED:", razorpayPaymentId);

      let existingOrder = await Order.findOne({ razorpayOrderId });

      if (existingOrder) {
        return res.json({ success: true });
      }

      const reserved = await ReservedOrder.findOne({ razorpayOrderId });

      if (!reserved) {
        console.log("❌ Reserved order not found. Maybe expired.");
        return res.json({ success: true });
      }

      // Create final order
      const finalOrder = await Order.create({
        user: reserved.userId,
        shippingAddress: reserved.addressId,
        paymentMethod: "Razorpay",

        orderItems: reserved.items.map(i => ({
          product: i.productId,
          quantity: i.reservedQty,
          price: i.reservedPrice,
          paymentStatus: "Paid"
        })),

        paymentDetails: {
          subtotal: reserved.subtotal,
          tax: reserved.tax,
          shipping: 0,
          processing: 0,
          totalPrice: reserved.totalAmount
        },

        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature: signature,
        currency: "INR"
      });

      console.log("✔ Final order created:", finalOrder._id);

      await ReservedOrder.deleteOne({ _id: reserved._id });
      await Cart.deleteOne({ user: reserved.userId });

      console.log("✔ Reserved order removed & cart cleared");

      return res.json({ success: true });
    }

    // =======================================================
    //   2️⃣ REFUND PROCESSED → Update refund + order item
    // =======================================================
    if (event === "refund.processed") {
      const refundEntity = req.body.payload.refund.entity;
      const refundId = refundEntity.id;

      console.log("✔ REFUND PROCESSED:", refundId);

      const refundRecord = await Refund.findOne({ refundId });

      if (!refundRecord) {
        console.log("❌ Refund record missing in DB");
        return res.json({ success: true });
      }

      refundRecord.status = "Credited";
      refundRecord.creditedAt = new Date();
      await refundRecord.save();

      const order = await Order.findById(refundRecord.order);
      if (order) {
        const item = order.orderItems.find(
          i => i.product.toString() === refundRecord.product.toString()
        );
        if (item) {
          item.paymentStatus = "Refund Credited";
          await order.save();
        }
      }

      return res.json({ success: true });
    }

    // =======================================================
    //   3️⃣ REFUND FAILED → Update status
    // =======================================================
    if (event === "refund.failed") {
      const refundEntity = req.body.payload.refund.entity;
      const refundId = refundEntity.id;

      console.log("❌ REFUND FAILED:", refundId);

      const refundRecord = await Refund.findOne({ refundId });

      if (refundRecord) {
        refundRecord.status = "Failed";
        refundRecord.failedAt = new Date();
        await refundRecord.save();
      }

      return res.json({ success: true });
    }

    // Ignore other events
    return res.json({ success: true });

  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({
      success: false,
      message: "Webhook processing error"
    });
  }
};
