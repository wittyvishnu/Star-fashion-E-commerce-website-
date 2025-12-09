import mongoose from "mongoose";

const reservedOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true
  },

  razorpayOrderId: {
    type: String,
    required: true
  },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      reservedQty: { type: Number, required: true },
      reservedPrice: { type: Number, required: true }
    }
  ],

  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  totalAmount: { type: Number, required: true },

  expiresAt: {
    type: Date,
    required: true
  }

}, { timestamps: true });

export default mongoose.model("ReservedOrder", reservedOrderSchema);
