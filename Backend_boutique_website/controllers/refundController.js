import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Refund from "../models/refundModel.js";
import razorpay from "../utiles/razorpay.js";

// =============================
// CANCEL PRODUCT (COD or ONLINE)
// =============================
export const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;

    if (!orderId || !productId) {
      return res.status(400).json({
        success: false,
        message: "orderId and productId are required"
      });
    }

    // 1️⃣ Fetch the order
    const order = await Order.findById(orderId).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 2️⃣ Check owner (USE req.user.id — DO NOT USE req.user._id)
    if (!order.user || !req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "Authentication mismatch"
      });
    }

    if (order.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this order"
      });
    }

    // 3️⃣ Find product inside order
    const item = order.orderItems.find(i => i.product._id.toString() === productId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in this order"
      });
    }

    if (item.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Item already cancelled"
      });
    }

    const qty = item.quantity;
    const price = item.price;

    const product = await Product.findById(productId);

    // ======================================
    //              COD CANCELLATION
    // ======================================
    if (order.paymentMethod === "COD") {
      product.stock += qty;
      await product.save();

      item.orderStatus = "Cancelled";
      item.paymentStatus = "Refunded"; // No payment taken for COD
      await order.save();

      return res.json({
        success: true,
        message: "COD item cancelled. Stock restored."
      });
    }

    // ======================================
    //           ONLINE PAYMENT REFUND
    // ======================================

    // Refund uses razorpayPaymentId from ORDER (not per item)
    const paymentId = order.razorpayPaymentId;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "razorpayPaymentId not found in order"
      });
    }

    // Refund = price + 5% GST
    const refundAmount = Math.round((price * 1.05) * 100); // in paise

    // Razorpay refund API
    const refund = await razorpay.payments.refund(paymentId, {
      amount: refundAmount
    });

    // Restore stock
    product.stock += qty;
    await product.save();

    // Update order item
    item.orderStatus = "Cancelled";
    item.paymentStatus = "Refunded";

    await order.save();

    // Log refund in DB (status = PROCESSING)
    const refundRecord = await Refund.create({
      order: order._id,
      product: productId,
      user: order.user,
      refundId: refund.id,
      paymentRefundId: refund.id,
      amount: refundAmount / 100,
      reason: reason || "Customer cancelled",
      status: "Processing",
      processedAt: new Date()
    });

    return res.json({
      success: true,
      message: "Refund initiated. Status = Processing",
      refundDetails: refundRecord
    });

  } catch (error) {
    console.error("Refund Cancel Error:", error);
    return res.status(500).json({
      success: false,
      message: "Refund failed",
      error: error.message
    });
  }
};

