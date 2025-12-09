// src/redux/services/cartSlice.js
import { apiSlice } from "./apiSlice";

const cartURL = '/cart';

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/cart
        getCart: builder.query({
            query: () => `${cartURL}`,
            providesTags: ['Cart'],
        }),

        // GET /api/cart/length
        getCartLength: builder.query({
            query: () => `${cartURL}/length`,
            providesTags: ['CartLength'],
        }),

        // POST /api/cart/items
        addOrUpdateItem: builder.mutation({
            query: (body) => ({ // Expects { productId, quantity }
                url: `${cartURL}/items`,
                method: 'POST',
                body: body,
            }),
            // --- UPDATED ---
            // Only invalidate Cart data. Do NOT invalidate 'Product'.
            invalidatesTags: (result, error, { productId }) => [
                'Cart', 
                'CartLength',
                // 'Product',  <-- REMOVED
                // { type: 'Product', id: productId } <-- REMOVED
            ],
        }),

        // DELETE /api/cart/items/:productId
        deleteItem: builder.mutation({
            query: (productId) => ({
                url: `${cartURL}/items/${productId}`,
                method: 'DELETE',
            }),
            // --- UPDATED ---
            // Only invalidate Cart data. Do NOT invalidate 'Product'.
            invalidatesTags: (result, error, productId) => [
                'Cart', 
                'CartLength',
                // 'Product',  <-- REMOVED
                // { type: 'Product', id: productId } <-- REMOVED
            ],
        }),
    }),
});

export const {
    useGetCartQuery,
    useGetCartLengthQuery,
    useAddOrUpdateItemMutation,
    useDeleteItemMutation,
} = cartApiSlice;