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
                // When loading the first page, just use whatever the API returned
                if (arg.page === 1) {
                    return {
                        ...newItems,
                        data: Array.isArray(newItems?.data)
                            ? newItems.data
                            : newItems?.data
                            ? [newItems.data]
                            : [],
                    };
                }

                // For subsequent pages, append new unique orders to the existing cache
                const existingData = Array.isArray(currentCache?.data)
                    ? currentCache.data
                    : [];

                const incomingArray = Array.isArray(newItems?.data)
                    ? newItems.data
                    : newItems?.data
                    ? [newItems.data]
                    : [];

                const mergedData = [
                    ...existingData,
                    ...incomingArray.filter(
                        (order) =>
                            !existingData.some(
                                (existing) => existing.orderId === order.orderId
                            )
                    ),
                ];

                return {
                    ...newItems,
                    data: mergedData,
                };
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