import cron from "node-cron";
import ReservedOrder from "../models/reservedOrderModel.js";
import Product from "../models/productModel.js";


// Runs every 1 minute
cron.schedule("* * * * *", async () => {
  try {

    const now = new Date();

    // 1️⃣ Get expired reserved orders
    const expiredOrders = await ReservedOrder.find({
      expiresAt: { $lte: now }
    });

    if (expiredOrders.length === 0) {
      
      return;
    }

    // 2️⃣ Process each expired reservation
    for (const order of expiredOrders) {
     

      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.reservedQty } }
        );

       
      }

      // 3️⃣ Delete the reservation
      await ReservedOrder.deleteOne({ _id: order._id });
    }
  } catch (err) {
    console.error("❌ Error in stock restore cron job:", err);
  }
});
