import { apiSlice } from './apiSlice'; // Import your main API slice

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: 'feedback', // Appended to the Base URL from apiSlice
        method: 'POST',
        body: feedbackData,
      }),
    }),
  }),
});

export const { useSubmitFeedbackMutation } = feedbackApi;