import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTrash, FaMapMarkerAlt, FaPhoneAlt, FaPlus, FaCheckCircle } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

import emptyCartImg from "../../Utiles/emptycart.png"

import { 
  useGetCartQuery, 
  useAddOrUpdateItemMutation, 
  useDeleteItemMutation 
} from "../../redux/services/cartSlice";
import { 
  useGetAddressesQuery, 
  useGetDefaultAddressQuery, 
  useSetDefaultAddressMutation, 
  useDeleteAddressMutation,
  useCreateAddressMutation,
  useUpdateAddressMutation
} from "../../redux/services/addressSlice";
import { useCreateOrderMutation, useVerifyPaymentMutation } from "../../redux/services/orderSlice"; 
import AddAddressForm from "../Profile/AddAddressForm";   
import EditAddressModal from "../Profile/EditAddressModal"; 
import PaymentModal from "../../Components/PaymentModal";

// Helper to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

export default function Cart() {
  const navigate = useNavigate();

  // --- API HOOKS ---
  const { data: cartData, isLoading: isCartLoading, refetch: refetchCart } = useGetCartQuery();
  const { data: addressesData, isLoading: isAddressesLoading } = useGetAddressesQuery();
  const { data: defaultAddressData } = useGetDefaultAddressQuery();
  
  const [addOrUpdateItem] = useAddOrUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyPaymentMutation();

  // --- LOCAL STATE ---
  const [localCart, setLocalCart] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const addresses = addressesData?.addresses || [];
  
  // Modal States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null); 
  const [openMenuFor, setOpenMenuFor] = useState(null);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [coupon, setCoupon] = useState("");

  // --- EFFECTS ---
  useEffect(() => {
    if (defaultAddressData?.address?.id) {
      setSelectedAddressId(defaultAddressData.address.id);
    } else if (addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [defaultAddressData, addresses]);

  useEffect(() => {
    if (cartData?.cartItems) {
      setLocalCart(cartData.cartItems);
    }
  }, [cartData]);

  // --- DEBOUNCE LOGIC ---
  const debounceTimers = useRef({});
  const debouncedUpdate = useCallback((productId, quantity) => {
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }
    debounceTimers.current[productId] = setTimeout(() => {
      addOrUpdateItem({ productId, quantity })
        .unwrap()
        .catch(err => {
          console.error('Failed to update item:', err);
          refetchCart();
        });
      delete debounceTimers.current[productId];
    }, 1500); 
  }, [addOrUpdateItem, refetchCart]);

  // --- CART ACTIONS ---
  const increaseQty = (productId) => {
    setLocalCart((items) =>
      items.map((it) => {
        if (it.productId === productId) {
          const newQuantity = it.quantity + 1;
          if (newQuantity > it.stock) return it;
          debouncedUpdate(productId, newQuantity); 
          return { ...it, quantity: newQuantity };
        }
        return it;
      })
    );
  };

  const decreaseQty = (productId) => {
    setLocalCart((items) =>
      items.map((it) => {
        if (it.productId === productId && it.quantity > 1) {
          const newQuantity = it.quantity - 1;
          debouncedUpdate(productId, newQuantity); 
          return { ...it, quantity: newQuantity };
        }
        return it;
      })
    );
  };

  const removeItem = (productId) => {
    setLocalCart((items) => items.filter((it) => it.productId !== productId));
    deleteItem(productId).unwrap().catch(err => {
      console.error('Failed to delete item:', err);
      refetchCart(); 
    });
  };

  // --- ADDRESS MODAL ACTIONS ---
  function openAddressModal() { setShowAddressModal(true); }
  function closeAddressModal() { setShowAddressModal(false); setOpenMenuFor(null); }
  function handleSetDefault(id) { setDefaultAddress(id); setSelectedAddressId(id); setOpenMenuFor(null); }
  function handleDeleteAddress(id) { deleteAddress(id); if (selectedAddressId === id) { const nextAddr = addresses.find((a) => a.id !== id); setSelectedAddressId(nextAddr ? nextAddr.id : null); } setOpenMenuFor(null); }
  function openAddAddress() { setShowAddressModal(false); setAddModalOpen(true); }
  function openEditAddress(address) { setEditData(address); setShowAddressModal(false); setEditModalOpen(true); setOpenMenuFor(null); }
  function handleSelectAddress(id) { setSelectedAddressId(id); }
  const handleAddSubmit = async (formData) => { try { await createAddress(formData).unwrap(); setAddModalOpen(false); } catch (err) { console.error('Failed to add address:', err); } };
  const handleEditSave = async (updatedFormData) => { if (!editData?.id) return; try { await updateAddress({ id: editData.id, ...updatedFormData }).unwrap(); setEditModalOpen(false); setEditData(null); } catch (err) { console.error('Failed to update address:', err); } };

  // --- FRONTEND CALCULATION ---
  const { subtotal, calculatedTax, total } = useMemo(() => {
    const validItems = localCart.filter(item => item.stock > 0);
    const subtotal = validItems.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    
    const taxRate = cartData?.taxrate || 0;
    const calculatedTax = subtotal * (taxRate / 100);
    const total = subtotal + calculatedTax;
    
    return { subtotal, calculatedTax, total };
  }, [localCart, cartData?.taxrate]); 

  // --- CHECKOUT LOGIC ---

  const handleCheckoutClick = () => {
    if (!selectedAddressId) {
      alert("Please select or add a shipping address.");
      return;
    }
    if (localCart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async (paymentMethod) => {
    try {
      const orderData = {
        addressId: selectedAddressId,
        totalAmount: total,
        paymentMethod: paymentMethod,
      };

      const response = await createOrder(orderData).unwrap();

      if (response.success) {
        if (paymentMethod === "COD") {
          setIsPaymentModalOpen(false);
          setShowSuccessAnimation(true);
          setTimeout(() => {
            navigate(`/orders`);
            window.location.reload(true); // Refresh to update order list
          }, 2500);
        } 
        else if (paymentMethod === "Razorpay") {
          await handleRazorpayPayment(response);
        }
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      const errorMsg = err.data?.message || err.message || "Failed to create order";
      
      if (errorMsg === "Stock issue" && err.data?.errors) {
        alert(`Stock issue: ${err.data.errors.join(", ")}`);
        refetchCart();
      } else {
        alert(errorMsg);
      }
      setIsPaymentModalOpen(false);
    }
  };

  const handleRazorpayPayment = async (orderResponse) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      setIsPaymentModalOpen(false);
      return;
    }

    const { razorpay: rzConfig } = orderResponse; 

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: rzConfig.amount,
      currency: rzConfig.currency,
      name: "StarFashion",
      description: "Order Payment",
      order_id: rzConfig.orderId,
      prefill: rzConfig.prefill,
      theme: {
        color: "#000000",
      },
      handler: async function (response) {
        try {
          const verifyData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          const verifyRes = await verifyPayment(verifyData).unwrap();

          if (verifyRes.success) {
            setIsPaymentModalOpen(false);
            setShowSuccessAnimation(true);
            setTimeout(() => {
              navigate(`/orders`);
              window.location.reload(true);
            }, 2500);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Verification error:", error);
          alert("Payment verification failed.");
        }
      },
      modal: {
        ondismiss: function () {
          setIsPaymentModalOpen(false);
          alert("Payment cancelled. You can retry from the orders page.");
          navigate('/orders');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // --- RENDER ---

  if (isCartLoading || isAddressesLoading) {
    return <div className="p-6 text-center">Loading cart...</div>;
  }

  if (showSuccessAnimation) {
    return (
      <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center">
        <div className="text-center animate-bounce">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Order Placed!</h2>
          <p className="text-gray-500 mt-2">Thank you for your purchase.</p>
        </div>
      </div>
    );
  }

  if (localCart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-white flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-medium mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some products to get started</p>
          <button
            onClick={() => navigate("/products")} 
            className="bg-black text-white px-10 py-3 rounded-full shadow font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue shopping
          </button>
          <div className="mt-12">
            <img src={emptyCartImg} alt="Empty shopping cart" className="mx-auto max-w-lg w-full h-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Find selected address object
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="p-4 sm:p-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-black hover:underline"
      >
        ← Continue Shopping
      </button>

      <h2 className="text-2xl font-semibold mb-2">Shopping Cart</h2>
      <p className="text-gray-500 mb-6">You have {cartData?.itemCount || 0} items in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: items */}
        <div className="lg:col-span-7 space-y-4">
          {localCart.map((item) => {
            const isOutOfStock = item.stock === 0;
            const isQuantityIssue = item.quantity > item.stock;
            const isUnavailable = isOutOfStock || isQuantityIssue;

            return (
              <div
                key={item.productId} 
                className={`relative rounded-xl border bg-white p-4 sm:p-5 flex gap-4 lg:grid lg:grid-cols-[88px_1fr_auto] lg:items-center ${
                  isUnavailable ? "border-red-300/80" : "hover:shadow-md"
                }`}
              >
                {isUnavailable && (
                  <div className="absolute left-4 -top-3 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-1 text-sm text-red-700">
                    <span className="text-xs font-bold">!</span>
                    {isOutOfStock 
                      ? <span>Product Unavailable</span>
                      : <span>Only {item.stock} available</span>
                    }
                  </div>
                )}

                {/* 1. Image: Fixed width on left */}
                <Link 
                  to={`/products/${item.productId}`} 
                  className="shrink-0 w-24 aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 lg:w-22"
                >
                  <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover" />
                </Link>

                {/* Wrapper for Mobile Content -> turns to 'contents' on Desktop to fall into grid */}
                <div className="flex flex-1 flex-col justify-between lg:contents">
                  
                  {/* 2. Info Section (Name, Size/Color, Desktop Price) */}
                  <div className="space-y-1 lg:col-start-2">
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="text-lg font-semibold leading-tight hover:underline line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600">Size : {item.size}</p>
                    <p className="text-sm text-gray-600">Color : {item.color}</p>
                    
                    {/* Price: Hidden on Mobile, Visible on Desktop (under info) */}
                    <p className="hidden lg:block pt-1 font-semibold">{inr(item.price)}</p>
                  </div>

                  {/* 3. Actions Section (Mobile Bottom Row / Desktop Right Col) */}
                  <div className="mt-2 flex items-center justify-between lg:mt-0 lg:col-start-3 lg:flex-col lg:items-end lg:gap-3">
                    
                    {/* Price: Visible on Mobile (Left side), Hidden on Desktop */}
                    <p className="font-semibold lg:hidden">{inr(item.price)}</p>

                    {/* Controls: Quantity & Delete */}
                    <div className="flex items-center gap-3 lg:flex-row-reverse ">
                      
                      {/* Quantity Adder */}
                      <div className="inline-flex items-center rounded-lg border border-black bg-white lg:order-2">
                        <button
                          onClick={() => decreaseQty(item.productId)}
                          disabled={isOutOfStock || item.quantity <= 1}
                          className="h-8 w-8 flex items-center justify-center text-black font-bold disabled:opacity-50"
                        >
                          -
                        </button>
                        <div className="px-2 text-sm font-medium tabular-nums">{item.quantity}</div>
                        <button
                          onClick={() => increaseQty(item.productId)}
                          disabled={isOutOfStock || item.quantity >= item.stock}
                          className="h-8 w-8 flex items-center justify-center text-black font-bold disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete Button - Order swapped on desktop to be at the top */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label="Remove item"
                        className="text-black lg:order-1 flex items-center justify-center"
                      >
                        <FaTrash />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Shipping Details</h3>
              {addresses.length > 0 && (
                <button
                  onClick={openAddressModal}
                  className="px-3 py-1 border rounded-full text-sm hover:bg-gray-100 transition-colors"
                >
                  Change
                </button>
              )}
            </div>

            {/* No Address State */}
            {addresses.length === 0 ? (
              <div className="text-center py-2">
                <p className="text-sm text-red-500 mb-2">Please add a shipping address</p>
                <button
                  onClick={openAddAddress}
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:border-black hover:text-black transition-colors"
                >
                  <FaPlus size={12} /> Add Address
                </button>
              </div>
            ) : (
              <div className="mt-3 text-sm space-y-2">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-0.5 text-black shrink-0" />
                  <p className="text-gray-700">
                    {selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}` : "No address selected"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhoneAlt className="mt-0.5 text-black shrink-0" />
                  <p className="text-gray-700">{selectedAddress?.contactPhone || "N/A"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border p-4 space-y-4">
            <h3 className="text-lg font-semibold">Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({cartData?.taxrate || 0}%)</span>
              <span>{inr(calculatedTax)}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Coupon</label>
              {/* Added w-full to ensure container respects parent padding */}
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  /* Added min-w-0 to allow input to shrink on small screens */
                  className="flex-1 min-w-0 border rounded px-3 py-2"
                />
                {/* Added shrink-0 to prevent button from squashing */ }
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 shrink-0">
                  Apply
                </button>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{inr(total)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              disabled={isCreatingOrder || isVerifyingPayment}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              Place order
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeAddressModal} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Address</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={openAddAddress}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  <FaPlus /> Add New
                </button>
                <button onClick={closeAddressModal} className="p-2">
                  <AiOutlineClose />
                </button>
              </div>
            </div>
            <div className="space-y-3 max-h-72 overflow-auto pr-2">
              {addresses.map((a) => (
                  <div
                    key={a.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded border ${
                      selectedAddressId === a.id ? "border-black bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === a.id}
                        onChange={() => handleSelectAddress(a.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong>{a.fullName}</strong>
                          {a.isDefault && <span className="text-xs px-2 py-0.5 rounded border">Default</span>}
                        </div>
                        <div className="text-sm text-gray-600">{a.street}, {a.city}</div>
                        <div className="text-sm text-gray-500">{a.contactPhone}</div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuFor(openMenuFor === a.id ? null : a.id)}
                        className="p-2"
                      >
                        <FiMoreVertical />
                      </button>
                      {openMenuFor === a.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white border rounded shadow z-10">
                          {!a.isDefault && (
                            <button
                              onClick={() => handleSetDefault(a.id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50"
                            >
                              Set as default
                            </button>
                          )}
                          <button
                            onClick={() => openEditAddress(a)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50"
                          >
                            Edit address
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(a.id)}
                            className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={closeAddressModal} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Use selected
              </button>
            </div>
          </div>
        </div>
      )}

      {addModalOpen && (
        <AddAddressForm
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          isCreating={isCreating}
        />
      )}

      {editModalOpen && (
        <EditAddressModal
          editData={editData}
          onClose={() => {
            setEditModalOpen(false);
            setEditData(null); 
          }}
          onSave={handleEditSave}
          isUpdating={isUpdating}
        />
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        totalAmount={total}
        isLoading={isCreatingOrder || isVerifyingPayment}
      />
      
    </div>
  );
}