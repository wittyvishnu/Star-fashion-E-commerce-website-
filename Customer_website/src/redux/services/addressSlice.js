import { apiSlice } from "./apiSlice";

const addressURL = '/addresses';

export const addressApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/addresses
        getAddresses: builder.query({
            query: (params) => ({
                url: `${addressURL}`,
                params: params,
            }),
            providesTags: (result) => 
                result?.addresses
                    ? [
                        ...result.addresses.map(({ id }) => ({ type: 'Address', id: id })),
                        { type: 'Address', id: 'LIST' },
                      ]
                    : [{ type: 'Address', id: 'LIST' }],
        }),

        // --- NEW ENDPOINT ADDED HERE ---
        // GET /api/addresses/:id
        getAddressById: builder.query({
            query: (id) => `${addressURL}/${id}`,
            providesTags: (result, error, id) => [{ type: 'Address', id }],
        }),

        // POST /api/addresses
        createAddress: builder.mutation({
            query: (newAddressData) => ({
                url: `${addressURL}`,
                method: 'POST',
                body: newAddressData,
            }),
            invalidatesTags: [{ type: 'Address', id: 'LIST' }],
        }),

        // PUT /api/addresses/:id
        updateAddress: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${addressURL}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Address', id },
                { type: 'Address', id: 'LIST' },
            ],
        }),

        // DELETE /api/addresses/:id
        deleteAddress: builder.mutation({
            query: (id) => ({
                url: `${addressURL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Address', id },
                { type: 'Address', id: 'LIST' },
            ],
        }),

        // PATCH /api/addresses/:id/default
        setDefaultAddress: builder.mutation({
            query: (id) => ({
                url: `${addressURL}/${id}/default`, 
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Address', id: 'LIST' }],
        }),

        // GET /api/addresses/default
        getDefaultAddress: builder.query({
            query: () => `${addressURL}/default`,
            providesTags: [{ type: 'Address', id: 'DEFAULT' }],
        }),
    }),
});

export const {
    useGetAddressesQuery,
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useSetDefaultAddressMutation,
    useGetDefaultAddressQuery,

    useGetAddressByIdQuery, 
} = addressApiSlice;