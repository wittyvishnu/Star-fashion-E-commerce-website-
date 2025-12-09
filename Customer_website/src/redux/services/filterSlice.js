import { apiSlice } from './apiSlice';

export const filterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for getting all categories
    getCategories: builder.query({
      query: () => '/categories',
    }),
    // Endpoint for getting all unique brands
    getBrands: builder.query({
      query: () => '/products/brands',
    }),
  }),
});

export const { useGetCategoriesQuery, useGetBrandsQuery } = filterApiSlice;