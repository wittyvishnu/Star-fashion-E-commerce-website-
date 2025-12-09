import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useGetOrderItemDetailsQuery, useCancelOrderItemMutation } from '../../redux/services/orderSlice';
import { FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa'; // Added FaUser
import { IoChevronBack } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/ai';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- HELPER FUNCTIONS ---
const inr = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatStatusDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
};

const getEstimatedDelivery = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatEstimatedDelivery = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    date.setDate(date.getDate() + 14); 
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.toLocaleDateString('en-US', { day: 'numeric' });
    return `${weekday} ${dayNum}`;
};

// --- RESPONSIVE STATUS TRACKER ---
const StatusTracker = ({ currentStatus, orderDate, estimatedDate, paymentMethod, refundStatus, refundDate }) => {
    let statuses = [];
    let currentIndex = 0;
    let isCancelled = false;

    if (currentStatus === 'Cancelled') {
        isCancelled = true;
        if (paymentMethod === 'COD') {
            statuses = ['Order Confirmed', 'Cancelled'];
            currentIndex = 1; 
        } else {
            statuses = ['Order Confirmed', 'Cancelled', 'Refund Processing', 'Refund Initiated'];
            if (refundStatus === 'Completed') currentIndex = 3; 
            else if (refundStatus === 'Processing') currentIndex = 2; 
            else currentIndex = 1; 
        }
    } else {
        statuses = ['Order Confirmed', 'Shipped', 'Out For Delivery', 'Delivered'];
        const displayStatus = currentStatus === 'Processing' ? 'Order Confirmed' : currentStatus;
        currentIndex = statuses.indexOf(displayStatus);
        if (currentIndex === -1) currentIndex = 0; 
    }

    return (
        <div className="w-full my-6">
            {/* Desktop View (Horizontal) */}
            <div className="hidden md:flex items-start justify-between relative">
                <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200" />
                <div 
                    className="absolute top-3 left-0 h-0.5 bg-black transition-all duration-500"
                    style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
                />
                {statuses.map((status, index) => {
                    const isActive = index <= currentIndex;
                    return (
                        <div key={status} className="z-10 flex flex-col items-center text-center w-24">
                            <div className={`w-6 h-6 rounded-full border-4 border-white ${isActive ? 'bg-black' : 'bg-gray-300'}`} />
                            <span className={`text-sm mt-2 ${index === currentIndex ? 'font-bold text-black' : 'text-gray-500'}`}>{status}</span>
                            {index === 0 && <span className="text-xs text-gray-400 mt-1">{orderDate}</span>}
                            {!isCancelled && index === statuses.length - 1 && <span className="text-xs text-gray-400 mt-1">Exp: {estimatedDate}</span>}
                            {isCancelled && status === 'Refund Initiated' && refundStatus === 'Completed' && (
                                <span className="text-xs text-gray-400 mt-1">{refundDate}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile View (Vertical) */}
            <div className="flex flex-col md:hidden space-y-0 pl-2">
                {statuses.map((status, index) => {
                    const isLast = index === statuses.length - 1;
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={status} className="flex gap-4 relative pb-8 last:pb-0">
                            {!isLast && (
                                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200">
                                    {isCompleted && index < currentIndex && (
                                        <div className="absolute inset-0 bg-black" />
                                    )}
                                </div>
                            )}
                            <div className={`z-10 flex-shrink-0 w-6 h-6 rounded-full border-2 ${isCompleted ? 'bg-black border-black' : 'bg-white border-gray-300'}`} />
                            <div className="-mt-1">
                                <p className={`text-sm ${isCurrent ? 'font-bold text-black' : 'text-gray-600'}`}>
                                    {status}
                                </p>
                                {index === 0 && <p className="text-xs text-gray-400 mt-0.5">Ordered: {orderDate}</p>}
                                {!isCancelled && isLast && <p className="text-xs text-green-600 mt-0.5 font-medium">Expected: {estimatedDate}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- CANCEL MODAL ---
const CancelModal = ({ isOpen, onClose, onConfirm, isProcessing }) => {
    const [reason, setReason] = useState("");
    const reasons = ["Changed my mind", "Found a better price", "Ordered by mistake", "Item delivery delayed", "Other"];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6 m-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Cancel Order</h3>
                    <button onClick={onClose}><AiOutlineClose /></button>
                </div>
                <div className="space-y-2 mb-6">
                    {reasons.map((r) => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" name="cancelReason" value={r} 
                                checked={reason === r} onChange={(e) => setReason(e.target.value)}
                                className="accent-black"
                            />
                            <span>{r}</span>
                        </label>
                    ))}
                </div>
                <button 
                    onClick={() => onConfirm(reason)}
                    disabled={!reason || isProcessing}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                    {isProcessing ? "Processing..." : "Confirm Cancellation"}
                </button>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const OrderDetail = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetOrderItemDetailsQuery(
        { orderId, productId }, { skip: !orderId || !productId }
    );
    const [cancelOrderItem, { isLoading: isCancelling }] = useCancelOrderItemMutation();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    if (isLoading) return <p className="text-center p-8">Loading order details...</p>;
    if (error) return <p className="text-center text-red-500 p-8">Error loading details.</p>;
    if (!data) return <p className="text-center p-8">Order not found.</p>;

    const { thumbnail, price, qty, size, color, shippingDetails, orderStatus, otherProductsInSameOrder, createdAt, paymentMethod, name } = data;

    // --- INVOICE GENERATION ---
    const handleDownloadInvoice = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text("INVOICE", 105, 20, null, null, "center");
            doc.setFontSize(10);
            doc.text(`Invoice No: ${orderId.substring(0, 8).toUpperCase()}`, 14, 30);
            doc.text(`Date: ${new Date(createdAt).toLocaleDateString()}`, 14, 35);
            
            doc.setFont(undefined, 'bold');
            doc.text("Bill To:", 14, 50);
            doc.setFont(undefined, 'normal');
            doc.text(shippingDetails.fullName, 14, 55);
            doc.text(`${shippingDetails.street}, ${shippingDetails.city}`, 14, 60);
            
            const itemTotal = price * qty;
            const taxAmount = itemTotal * 0.05;
            const finalTotal = itemTotal + taxAmount;

            autoTable(doc, {
                startY: 80,
                head: [["Item", "Size", "Qty", "Price", "Total"]],
                body: [[name, size, qty, `Rs. ${price}`, `Rs. ${itemTotal}`]],
                theme: 'grid',
                headStyles: { fillColor: [0, 0, 0] },
            });

            const finalY = (doc.lastAutoTable?.finalY || 80) + 10;
            doc.text(`Subtotal: Rs. ${itemTotal.toFixed(2)}`, 140, finalY);
            doc.text(`Tax (5%): Rs. ${taxAmount.toFixed(2)}`, 140, finalY + 5);
            doc.setFont(undefined, 'bold');
            doc.text(`Grand Total: Rs. ${finalTotal.toFixed(2)}`, 140, finalY + 12);
            
            doc.save(`Invoice_${orderId}.pdf`);
        } catch (err) {
            console.error("PDF Generation Error:", err);
            alert("Failed to generate invoice. Please try again.");
        }
    };

    const handleConfirmCancel = async (reason) => {
        try {
            await cancelOrderItem({ orderId, productId, reason }).unwrap();
            setIsCancelModalOpen(false);
        } catch (err) {
            alert(err.data?.message || "Failed to cancel.");
        }
    };

    const subtotal = price * qty;
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-gray-700 font-medium mb-6 hover:text-black">
                <IoChevronBack /> Shopping Continue
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <span className="text-sm text-gray-600">Order date: <span className="font-medium text-black">{formatDate(createdAt)}</span></span>
                <span className="text-sm text-gray-600">Estimated delivery: <span className="font-medium text-black">{getEstimatedDelivery(createdAt)}</span></span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* PRODUCT CARD (Responsive Row Layout) */}
                    <div className="flex flex-row items-center gap-4 p-4 border rounded-lg">
                        <Link to={`/products/${productId}`} className="flex-shrink-0">
                            <img src={thumbnail} alt={name} className="w-24 h-24 object-cover rounded-md" />
                        </Link>

                        <div className="flex flex-col flex-1 gap-1">
                            <Link to={`/products/${productId}`}>
                                <h2 className="text-base sm:text-lg font-semibold hover:underline line-clamp-2 leading-tight">
                                    {name}
                                </h2>
                            </Link>
                            <p className="text-sm text-gray-600">Size: {size} | Color: {color}</p>

                            {/* Mobile Price */}
                            <div className="flex md:hidden items-center gap-4 mt-2">
                                <p className="text-lg font-semibold">{inr(price)}</p>
                                <p className="text-sm text-gray-600">Qty: {qty}</p>
                            </div>
                        </div>

                        {/* Desktop Price */}
                        <div className="hidden md:flex flex-col items-end text-right">
                            <p className="text-lg font-semibold">{inr(price)}</p>
                            <p className="text-sm text-gray-600">Qty: {qty}</p>
                        </div>
                    </div>

                    {/* STATUS TRACKER */}
                    <div className="p-4 border rounded-lg">
                        <StatusTracker 
                            currentStatus={orderStatus} 
                            orderDate={formatStatusDate(createdAt)}
                            estimatedDate={formatEstimatedDelivery(createdAt)}
                            paymentMethod={paymentMethod}
                            refundStatus={data.refundStatus}
                            refundDate={data.refundProcessedDate}
                        />
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4">
                        {orderStatus !== 'Cancelled' && orderStatus !== 'Delivered' && orderStatus !== 'Refunded' ? (
                            <button onClick={() => setIsCancelModalOpen(true)} className="flex-1 border border-red-200 text-red-600 rounded-lg py-3 font-semibold hover:bg-red-50">
                                Cancel Item
                            </button>
                        ) : (
                            <button disabled className="flex-1 border border-gray-200 text-gray-400 rounded-lg py-3 font-semibold cursor-not-allowed">
                                {orderStatus === 'Delivered' ? 'Return Item' : 'Cancelled'}
                            </button>
                        )}
                        <button className="flex-1 bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800">Track Order</button>
                    </div>

                    {otherProductsInSameOrder?.length > 0 && (
                        <div className="p-4 border rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">Other Products in this Order</h3>
                            <div className="flex gap-4 overflow-x-auto">
                                {otherProductsInSameOrder.map(item => (
                                    <Link key={item.productId} to={`/orders/${orderId}?productId=${item.productId}`} className="flex-shrink-0">
                                        <img src={item.thumbnail} alt="Product" className="w-24 h-24 object-cover rounded-md border" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* --- UPDATED SHIPPING DETAILS --- */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
                        
                        {/* 1. User Name (Added Icon, Standardized Size) */}
                        <div className="flex items-start gap-3">
                            <FaUser className="mt-1 text-gray-600 w-5 h-5 flex-shrink-0" />
                            <p className="font-medium text-gray-900">{shippingDetails.fullName}</p>
                        </div>
                        
                        {/* 2. Address (Fixed Tiny Icon) */}
                        <div className="flex items-start gap-3 mt-3">
                            <FaMapMarkerAlt className="mt-1 text-gray-600 w-5 h-5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                                {shippingDetails.street}, {shippingDetails.city}, {shippingDetails.zipCode}
                            </p>
                        </div>

                        {/* 3. Phone (Fixed Rotation & Size) */}
                        <div className="flex items-start gap-3 mt-3">
                            {/* scale-x-[-1] flips the phone to face the number */}
                            <FaPhone className="mt-1 text-gray-600 w-5 h-5 flex-shrink-0 scale-x-[-1]" />
                            <p className="text-sm text-gray-600">{shippingDetails.contactPhone}</p>
                        </div>
                    </div>
                    
                    {/* SUMMARY */}
                    <div className="p-6 bg-gray-50 rounded-lg space-y-3">
                        <h3 className="text-xl font-semibold mb-4">Summary</h3>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span> <span>{inr(subtotal)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Tax (5%)</span> <span>{inr(tax)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span> <span>Free</span></div>
                        <div className="border-t my-2" />
                        <div className="flex justify-between font-semibold"><span>Total</span> <span>{inr(total)}</span></div>
                    </div>

                    <button onClick={handleDownloadInvoice} className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800">
                        Download Invoice
                    </button>
                </div>
            </div>

            <CancelModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={handleConfirmCancel} isProcessing={isCancelling} />
        </div>
    );
};

export default OrderDetail;