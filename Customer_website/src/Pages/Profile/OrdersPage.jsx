import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Import images from Utils folder
import orders1 from '../../Utiles/orders1.png';
import orders2 from '../../Utiles/orders2.png';
import orders3 from '../../Utiles/orders3.png';
import orders4 from '../../Utiles/orders4.png';
import orders5 from '../../Utiles/orders5.png';
import orders6 from '../../Utiles/orders6.png';

const OrdersPage = () => {
  const navigate = useNavigate();

  const mockOrders = [
    {
      orderId: "S8GYTI234565",
      items: [
        {
          name: "",
          status: "Estimated Delivery by 21 Aug",
          price: 340.45,
          payment: "UPI / Gift card",
          image: orders1,
        },
        {
          name: "",
          status: "Delivered on 21 Aug",
          price: 240.45,
          payment: "UPI / Gift card",
          image: orders2,
          canRate: true,
        },
        {
          name: "",
          status: "Refunded on 21 Aug",
          price: 240.45,
          payment: "UPI / Gift card",
          image: orders3,
          isRefunded: true,
        },
        {
          name: "",
          status: "Cancellation in process",
          price: 840.45,
          payment: "UPI / Gift card",
          image: orders4,
        },
      ],
    },
    {
      orderId: "S8GYTI234560",
      items: [
        {
          name: "",
          status: "Refunded on 21 Aug",
          price: 240.45,
          payment: "UPI / Gift card",
          image: orders5,
          isRefunded: true,
        },
        {
          name: "",
          status: "Delivered on 21 Aug",
          price: 240.45,
          payment: "UPI / Gift card",
          image: orders6,
          canRate: true,
        },
      ],
    },
  ];

  return (
    <div className="flex justify-center py-6">
      <div className="w-[824px] h-[1337px] bg-white rounded-lg shadow-lg px-6 py-4 space-y-6 overflow-y-auto">
        {/* 🔙 Top-left navigation button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <span className="mr-1 text-xl">←</span> Shopping Continue
        </button>

        <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>

        {mockOrders.map((order) => (
          <div key={order.orderId} className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-start md:items-center gap-4 border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[104px] h-[129px] object-cover rounded-[10px]"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">Status: {item.status}</p>
                  <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-sm text-gray-600">Payment: {item.payment}</p>
                  {item.isRefunded && (
                    <p className="text-sm text-red-500">
                     Refunded ₹{item.price} on {item.status.split("on ")[1]}
                    </p>
                  )}
                  {item.canRate && (
                    <button className="text-blue-600 text-sm underline hover:text-blue-800">
                      Rate Product
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
