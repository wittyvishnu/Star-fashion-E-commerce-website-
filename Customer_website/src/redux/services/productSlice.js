import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => `/products?${params}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const newQueryArgs = { ...queryArgs };
        delete newQueryArgs.page;
        const serialized = new URLSearchParams(newQueryArgs).toString();
        return `${endpointName}(${serialized})`;
      },
      merge: (currentCache, newItems) => {
        currentCache.data.push(...newItems.data);
        currentCache.pagination = newItems.pagination;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    // --- ADD THIS NEW ENDPOINT ---
    getProductSuggestions: builder.query({
      query: ({ productId, params }) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/products/${productId}/suggestions?${queryParams}`;
      },
      providesTags: ["Product"],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery,
  useGetProductSuggestionsQuery // <-- Export the new hook
} = productApiSlice;