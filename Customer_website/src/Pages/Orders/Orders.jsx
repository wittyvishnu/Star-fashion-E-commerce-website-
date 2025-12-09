import React, { useState, useEffect, useRef } from 'react';
import { useGetAllOrdersQuery } from '../../redux/services/orderSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import emptyOrdersImg from '../../Utiles/emptyorders.png'; 

// --- HELPER FUNCTIONS ---
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric' 
    });
};

const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

// --- ORDER ITEM COMPONENT ---
const OrderItem = ({ orderId, item, paymentMethod }) => {
    let statusColor = "text-yellow-600"; 

    if (item.orderStatus === 'Delivered') {
        statusColor = "text-green-600";
    } else if (item.orderStatus === 'Cancelled') {
        statusColor = "text-red-600";
    } else if (item.orderStatus === 'Refunded' || item.paymentStatus === 'Refunded') {
        statusColor = "text-blue-600";
    }

    let statusText = item.message || item.orderStatus;

    if (!item.message) {
        if (item.orderStatus === "Delivered") {
            statusText = `Delivered on ${formatDate(item.updatedAt || new Date())}`;
        } else if (item.orderStatus === "Cancelled") {
            statusText = "Cancelled";
        } else if (item.orderStatus === "Refunded") {
            statusText = "Refunded";
        }
    }

    return (
        <Link 
            to={`/orders/${orderId}?productId=${item.productId}`}
            className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
        >
            <img 
                src={item.thumbnail} 
                alt={item.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0" 
            />
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${statusColor} truncate`}>{statusText}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{item.name}</p> 
                <p className="text-xs text-gray-400 mt-0.5">{paymentMethod}</p>
                
                {item.orderStatus === "Delivered" ? (
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        <span className="hidden sm:inline">Rate product:</span>
                        <div className="flex gap-0.5 text-gray-400">
                            <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm font-medium mt-1">{inr(item.price * item.quantity)}</p>
                )}
            </div>
            <IoChevronForward className="text-gray-400 flex-shrink-0 self-center" />
        </Link>
    );
};

// --- MAIN ORDERS PAGE ---
const Orders = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("Past 6 months");
    const loaderRef = useRef(null);

    // 1. We keep 'refetch' to manually force an update on mount
    const { data, isLoading, isFetching, error, refetch } = useGetAllOrdersQuery(
        { page },
        { 
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true 
        }
    );

    // 2. Force a fresh fetch every time this page opens
    useEffect(() => {
        refetch();
    }, [refetch]);

    // 3. Handle Data Structure
    let orders = [];
    if (data?.data) {
        if (Array.isArray(data.data)) {
            orders = data.data;
        } else {
            orders = [data.data];
        }
    }
    const pagination = data?.pagination;

    // 4. IMPROVED LOADING LOGIC
    // If we are fetching (even in background) and we are on page 1, show loading.
    // This prevents showing the "No Orders" screen while the new order is being fetched.
    const showLoading = isLoading || (isFetching && page === 1);

    // 5. IMPROVED EMPTY STATE CHECK
    // Only say "No orders" if we are NOT loading, NOT fetching, and truly have 0 orders.
    const isNoOrdersError = error?.status === 404 || error?.data?.message === "No orders found";
    const isRealError = error && !isNoOrdersError;
    
    const isEmptyState = !showLoading && !isFetching && (orders.length === 0 || isNoOrdersError);

    // Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting && !isFetching && pagination && pagination.hasNext) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        const currentLoader = loaderRef.current;
        if (currentLoader) observer.observe(currentLoader);

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [isFetching, pagination]);

    // RENDER STATES
    
    // A. Loading: Shows if initial load OR background fetch on Page 1
    if (showLoading) return <p className="text-center p-8 mt-10">Loading your orders...</p>;

    // B. Error
    if (isRealError) return (
        <div className="text-center p-8 mt-10">
            <p className="text-red-500 mb-4">Something went wrong fetching your orders.</p>
            <button onClick={() => window.location.reload()} className="underline text-sm">Retry</button>
        </div>
    );

    // C. Empty (Only shows if strictly empty and not fetching)
    if (isEmptyState) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <img 
                    src={emptyOrdersImg} 
                    alt="No orders found" 
                    className="w-40 h-40 sm:w-64 sm:h-64 object-contain mb-6 opacity-90"
                />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    No orders found
                </h2>
                <p className="text-gray-500 mb-8 max-w-xs sm:max-w-md text-sm sm:text-base">
                    Looks like you haven't placed any orders yet. Start shopping to fill this up!
                </p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-transform active:scale-95 shadow-md"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    // D. Data List
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-gray-700 font-medium mb-6 hover:text-black transition-colors"
            >
                <IoChevronBack /> Shopping Continue
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl font-semibold">Your orders</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {pagination ? `You have ${pagination.total} orders` : ''}
                    </p>
                </div>
                
                
            </div>

            <div className="space-y-4 sm:space-y-6">
                {orders.map((order) => (
                    <div key={order.orderId} className="border rounded-lg overflow-hidden shadow-sm bg-white">
                        <div className="bg-gray-50 p-3 sm:p-4 border-b">
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                Order ID: <span className="font-mono">{order.orderId}</span>
                            </span>
                        </div>
                        <div className="divide-y">
                            {(order.items || []).map(item => (
                                <OrderItem 
                                    key={item.productId} 
                                    orderId={order.orderId} 
                                    item={item} 
                                    paymentMethod={order.paymentMethod}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div ref={loaderRef} className="h-20 text-center pt-4">
                {isFetching && page > 1 && <p className="text-gray-500 text-sm">Loading more orders...</p>}
                {!isFetching && pagination && !pagination.hasNext && orders.length > 0 && (
                    <p className="text-gray-400 text-xs uppercase tracking-wider">End of list</p>
                )}
            </div>
        </div>
    );
};

export default Orders;