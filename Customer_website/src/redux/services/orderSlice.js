// src/redux/services/orderSlice.js
import { apiSlice } from "./apiSlice";

const orderURL = '/orders';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // POST /api/orders
        createOrder: builder.mutation({
            query: (orderData) => ({ 
                url: `${orderURL}`,
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Cart', 'CartLength', 'Order', 'Product'],
        }),

        // POST /api/orders/verify-payment
        verifyPayment: builder.mutation({
            query: (paymentData) => ({ 
                url: `${orderURL}/verify-payment`,
                method: 'POST',
                body: paymentData,
            }),
            invalidatesTags: ['Order', 'Cart', 'CartLength'],
        }),

        // --- CANCEL ITEM ---
        // POST /api/refund/cancel-item
        cancelOrderItem: builder.mutation({
            query: (data) => ({ // Expects { orderId, productId, reason }
                url: '/refund/cancel-item', // <--- Corrected URL (No ${orderURL})
                method: 'POST',
                body: data,
            }),
            // Invalidate 'Order' to refresh the details page and show "Cancelled" status
            invalidatesTags: (result, error, arg) => [
                { type: 'Order', id: arg.orderId },
                'Order'
            ], 
        }),

        // GET /api/orders
        getAllOrders: builder.query({
            query: (params) => ({ 
                url: `${orderURL}`,
                params: params,
            }),
            providesTags: (result) => {
                const tags = [{ type: 'Order', id: 'LIST' }, 'Order']; 
                if (result?.data) {
                    const dataArray = Array.isArray(result.data) ? result.data : [result.data];
                    dataArray.forEach(order => {
                        tags.push({ type: 'Order', id: order.orderId });
                    });
                }
                return tags;
            },
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page === 1) {
                    return {
                        message: newItems.message,
                        pagination: newItems.pagination,
                        data: newItems.data?.orderId ? [newItems.data] : [] 
                    };
                }
                if (newItems.data?.orderId) {
                    const dataArray = Array.isArray(currentCache.data) ? currentCache.data : [];
                    const existing = dataArray.find(o => o.orderId === newItems.data.orderId);
                    if (!existing) {
                        return {
                            ...currentCache,
                            pagination: newItems.pagination,
                            message: newItems.message,
                            data: [...dataArray, newItems.data]
                        };
                    }
                }
                return currentCache;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),

        // GET /api/orders/:orderId?productId=:productId
        getOrderItemDetails: builder.query({
            query: ({ orderId, productId }) => 
                `${orderURL}/${orderId}?productId=${productId}`,
            providesTags: (result, error, { orderId, productId }) => 
                [{ type: 'Order', id: orderId }, { type: 'Product', id: productId }],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useVerifyPaymentMutation,
    useCancelOrderItemMutation, 
    useGetAllOrdersQuery,
    useGetOrderItemDetailsQuery,
} = orderApiSlice;