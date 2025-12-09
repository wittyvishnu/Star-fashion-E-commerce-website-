// src/redux/services/profileSlice.js
import { apiSlice } from "./apiSlice";

// We use the existing '/users' base URL from your other slices
const usersURL = '/users';

export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Query for GET /api/users/me
        getProfile: builder.query({
            query: () => ({
                url: `${usersURL}/me`,
                method: 'GET',
            }),
            // Provides a tag to cache the user's profile data
            providesTags: (result, error, id) => [{ type: 'User', id: 'PROFILE' }],
        }),

        // Mutation for PUT /api/users/profile
        updateProfile: builder.mutation({
            query: (data) => ({ // Expects an object like { name, email, phone }
                url: `${usersURL}/profile`,
                method: 'PUT',
                body: data, // RTK Query automatically sends this as JSON
            }),
            // Invalidates the cache tag, forcing getProfile to refetch
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: 'PROFILE' }],
        }),
    }),
});

// Export the auto-generated hooks
export const {
    useGetProfileQuery,
    useUpdateProfileMutation
} = profileApiSlice;