// src/Components/PaymentModal.jsx
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

const PaymentModal = ({ isOpen, onClose, onConfirm, totalAmount, isLoading }) => {
  const [paymentMethod, setPaymentMethod] = useState('COD'); // Default to COD

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(paymentMethod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Select Payment Method</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 mb-4">
            Total Amount to Pay: <span className="font-bold text-black">₹{totalAmount}</span>
          </p>

          {/* COD Option */}
          <label 
            className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
              paymentMethod === 'COD' 
                ? 'border-black bg-gray-50 ring-1 ring-black' 
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <input 
              type="radio" 
              name="payment" 
              value="COD" 
              checked={paymentMethod === 'COD'} 
              onChange={() => setPaymentMethod('COD')}
              className="w-5 h-5 text-black accent-black"
            />
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full text-green-600">
              <FaMoneyBillWave size={20} />
            </div>
            <div>
              <p className="font-semibold">Cash on Delivery</p>
              <p className="text-xs text-gray-500">Pay with cash upon delivery</p>
            </div>
          </label>

          {/* Razorpay Option */}
          <label 
            className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
              paymentMethod === 'Razorpay' 
                ? 'border-black bg-gray-50 ring-1 ring-black' 
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <input 
              type="radio" 
              name="payment" 
              value="Razorpay" 
              checked={paymentMethod === 'Razorpay'} 
              onChange={() => setPaymentMethod('Razorpay')}
              className="w-5 h-5 text-black accent-black"
            />
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-blue-600">
              <FaCreditCard size={20} />
            </div>
            <div>
              <p className="font-semibold">Pay Online (Razorpay)</p>
              <p className="text-xs text-gray-500">UPI, Cards, Wallets, NetBanking</p>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-black transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;