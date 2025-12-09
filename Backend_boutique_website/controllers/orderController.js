// controllers/orderController.js
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import mongoose from 'mongoose';
import razorpay from '../utiles/razorpay.js'
import { User } from '../models/userModel.js';
import ReservedOrder from "../models/reservedOrderModel.js";
import crypto from "crypto";
import Refund from '../models/refundModel.js';
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { addressId, totalAmount, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId })
      .populate("cartItems.product")
      .session(session);

    if (!cart || cart.cartItems.length === 0) {
      throw new Error("Cart empty");
    }

    // 🧮 Calculate subtotal
    let subtotal = 0;
    for (const item of cart.cartItems) {
      if (item.quantity > item.product.stock) {
        throw new Error(`${item.product.name} has only ${item.product.stock} left`);
      }
      subtotal += item.product.price * item.quantity;
    }

    const tax = Number((subtotal * 0.05).toFixed(2));
    const calculatedTotal = Number((subtotal + tax).toFixed(2));

    if (calculatedTotal !== Number(totalAmount)) {
      throw new Error(`Total mismatch: expected ${calculatedTotal}, got ${totalAmount}`);
    }

    // ---------------------------------------
    // 🔻 STEP 1: REDUCE STOCK (IN TRANSACTION)
    // ---------------------------------------
    for (const item of cart.cartItems) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // =======================================
    // 🟩 COD ORDER FLOW (COMMIT TRANSACTION)
    // =======================================
    if (paymentMethod === "COD") {
      const newOrder = await Order.create([{
        user: userId,
        shippingAddress: addressId,
        paymentMethod,

        orderItems: cart.cartItems.map(i => ({
          product: i.product._id,
          quantity: i.quantity,
          price: i.product.price,
          paymentStatus: "Paid"
        })),

        paymentDetails: {
          subtotal,
          tax,
          shipping: 0,
          processing: 0,
          totalPrice: calculatedTotal
        }
      }], { session });

      await Cart.deleteOne({ user: userId }, { session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "COD order placed",
        orderId: newOrder[0]._id
      });
    }

    // =======================================
    // 🟧 RAZORPAY ORDER FLOW (STORE TEMP DATA)
    // =======================================
    if (paymentMethod === "Razorpay") {
      const razorpayOrder = await razorpay.orders.create({
        amount: calculatedTotal * 100,
        currency: "INR",
        receipt: "rcpt_" +userId
      });

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await ReservedOrder.create([{
        userId,
        addressId,
        razorpayOrderId: razorpayOrder.id,
        subtotal,
        tax,
        totalAmount: calculatedTotal,
        expiresAt,

        items: cart.cartItems.map(i => ({
          productId: i.product._id,
          reservedQty: i.quantity,
          reservedPrice: i.product.price
        }))
      }], { session });

      await session.commitTransaction();
      session.endSession();

      const user = await User.findById(userId).select("name email phone");

      return res.status(200).json({
        success: true,
        message: "Razorpay order created",
        razorpay: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone
          }
        }
      });
    }

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("CREATE ORDER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new Error("Missing Razorpay fields");
    }

    // 1️⃣ Check signature
    const hmacString = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(hmacString)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      throw new Error("Invalid payment signature");
    }

    // 2️⃣ Fetch reserved order (NO req.user needed)
    const reserved = await ReservedOrder.findOne({ razorpayOrderId }).session(session);

    if (!reserved) {
      throw new Error("order not found");
    }

    // ⭐ Get userId from reserved order
    const userId = reserved.userId;
  

    // 3️⃣ Create final order
    const finalOrder = await Order.create([{
      user: userId,
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
      razorpaySignature,
      currency: "INR"
    }], { session });



    // 4️⃣ Delete reserved order
    await ReservedOrder.deleteOne({ _id: reserved._id }, { session });

    // 5️⃣ Clear user's cart
    await Cart.deleteOne({ user: userId }, { session });

    // 6️⃣ Commit
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Payment verified, order created",
      orderId: finalOrder[0]._id
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 1;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: userId });

    const order = await Order.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("orderItems.product", "name thumbnail")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Helper to format dates: "21 Aug"
    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      });

    const createdDate = new Date(order.createdAt);

    const estimatedDelivery = new Date(order.createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 14);

    const estimatedDeliveryStr = formatDate(estimatedDelivery);
    const createdDateStr = formatDate(createdDate);

    // Build formatted items
    const formattedItems = await Promise.all(
      order.orderItems.map(async (item) => {
        let message = "";

        // Processing / Shipped
        if (["Processing", "Shipped"].includes(item.orderStatus)) {
          message = `Estimated delivery by ${estimatedDeliveryStr}`;
        }

        // Delivered
        else if (item.orderStatus === "Delivered") {
          message = `Delivered `;
        }

        // Cancelled
        else if (item.orderStatus === "Cancelled") {
          if (order.paymentMethod === "COD") {
            message = `Cancelled`;
          } else {
            // Razorpay refund status
            const refund = await Refund.findOne({
              order: order._id,
              product: item.product._id
            }).lean();

            if (!refund) {
              message = "Refund status unavailable";
            } else {
              switch (refund.status) {
                case "Processing":
                  message = "Refund is processing";
                  break;

                case "Completed":
                  message = "Refund is completed on " + formatDate(refund.processedAt);
                  break;

            
                case "Failed":
                  message = "Refund failed";
                  break;

                default:
                  message = "Refund status unavailable";
              }
            }
          }
        }

        return {
          productId: item.product._id,
          thumbnail: item.product.thumbnail,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          orderStatus: item.orderStatus,
          paymentStatus: item.paymentStatus,
          message
        };
      })
    );

    // Final response
    res.status(200).json({
      message: "Order fetched successfully",
      data: {
        orderId: order._id,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount || order.paymentDetails?.totalPrice,
        createdAt: order.createdAt,
        items: formattedItems
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { productId } = req.query;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Fetch order with populated details
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("orderItems.product", "name thumbnail size color cloth")
      .populate({
        path: "shippingAddress",
        select: "fullName contactPhone street city state country zipCode email",
      })
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const targetItem = order.orderItems.find(
      (item) => item.product._id.toString() === productId
    );

    if (!targetItem) {
      return res
        .status(404)
        .json({ message: "Product not found in this order" });
    }

    // Other products except current one
    const otherProducts = order.orderItems
      .filter((item) => item.product._id.toString() !== productId)
      .map((item) => ({
        productId: item.product._id,
        thumbnail: item.product.thumbnail,
      }));

    // IST formatted createdAt
    const createdAtIST = new Date(order.createdAt)
      .toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");

    // Helper to format refund dates like "04 Dec"
    const formatShortDate = (date) =>
      new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

    // ================================
    // 🔥 FETCH REFUND DETAILS FOR RAZORPAY CANCELLED ITEMS
    // ================================
    let refundInfo = {};

    if (
      order.paymentMethod === "Razorpay" &&
      targetItem.orderStatus === "Cancelled"
    ) {
      const refund = await Refund.findOne({
        order: orderId,
        product: productId,
      }).lean();

      if (!refund) {
        refundInfo.refundStatus = "Not Available";
      } else {
        refundInfo.refundStatus = refund.status;

        // Only add processed date if available
        if (refund.processedAt) {
          refundInfo.refundProcessedDate = formatShortDate(
            refund.processedAt
          );
        }
      }
    }

    // ================================
    // 📌 BUILD FINAL RESPONSE
    // ================================
    const response = {
      orderId: order._id,
      productId: targetItem.product._id,
      thumbnail: targetItem.product.thumbnail,
      price: targetItem.price,
      qty: targetItem.quantity,
      size: targetItem.product.size,
      color: targetItem.product.color,
      cloth: targetItem.product.cloth,

      shippingDetails: {
        fullName: order.shippingAddress.fullName,
        contactPhone: order.shippingAddress.contactPhone || null,
        street: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        country: order.shippingAddress.country,
        zipCode: order.shippingAddress.zipCode,
        email: order.shippingAddress.email,
      },

      paymentId: targetItem.paymentId,
      paymentStatus: targetItem.paymentStatus,
      trackingId: targetItem.trackingId,
      orderStatus: targetItem.orderStatus,
      otherProductsInSameOrder: otherProducts,
      createdAt: createdAtIST,
      paymentMethod: order.paymentMethod,
      name: targetItem.product.name,
    };

    // Only include refund details if Razorpay + Cancelled
    if (Object.keys(refundInfo).length > 0) {
      response.refundStatus = refundInfo.refundStatus;
      if (refundInfo.refundProcessedDate) {
        response.refundProcessedDate = refundInfo.refundProcessedDate;
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Order fetch error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


export const updateOrder = (req, res) => {
  console.log('Update Order called at', new Date().toLocaleString());
  res.status(200).json({ message: `Order with ID ${req.params.id} updated` });
};

export const deleteOrder = (req, res) => {
  console.log('Delete Order called at', new Date().toLocaleString());
  res.status(200).json({ message: `Order with ID ${req.params.id} deleted` });
};

export const updateOrderStatus = (req, res) => {
  console.log('Update Order Status called at', new Date().toLocaleString());
  res.status(200).json({ message: `Order status with ID ${req.params.id} updated` });
};