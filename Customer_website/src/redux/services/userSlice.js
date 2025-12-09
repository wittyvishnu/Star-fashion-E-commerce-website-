import { apiSlice } from "./apiSlice";

// Note: Your base URL from apiSlice.js already includes '/api'
const usersURL = '/users';
const otpURL = '/otp';


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Sends the initial OTPs to email and phone
        sendOtp: builder.mutation({
            query: (data) => ({ // Expects { contact, purpose }
                url: `${otpURL}`,
                method: 'POST',
                body: data,
            }),
        }),

        // Resends an OTP to a specific contact
        resendOtp: builder.mutation({
            query: (data) => ({ // Expects { contact, purpose }
                url: `${otpURL}/resend`,
                method: 'POST',
                body: data,
            }),
        }),

        // Verifies an OTP before final signup
        verifyOtp: builder.mutation({
            query: (data) => ({ // Expects { contact, otp, purpose }
                url: `${otpURL}/verify`,
                method: 'POST',
                body: data,
            }),
        }),

        // Final user registration
        signup: builder.mutation({
            query: (userData) => ({ // Expects { name, email, phone, password, emailOtp, phoneOtp }
                url: `${usersURL}/signup`,
                method: "POST",
                body: userData,
            }),
        }),

        // User login
        login: builder.mutation({
            query: (credentials) => ({ // Expects { contact, password }
                url: `${usersURL}/login`,
                method: "POST",
                body: credentials,
            }),
        }),

        // Initiates the forgot password process
        forgotPassword: builder.mutation({
            query: (data) => ({ // Expects { contact }
                url: `${usersURL}/forgot-password`,
                method: 'POST',
                body: data,
            }),
        }),

        // Resets the password using an OTP
        resetPassword: builder.mutation({
            query: (data) => ({ // Expects { contact, otp, newPassword }
                url: `${usersURL}/reset-password`,
                method: 'POST',
                body: data,
            }),
            
        }),
        verifyToken: builder.mutation({
            query: () => ({
                url: `${usersURL}/verify-token`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useSendOtpMutation,
    useResendOtpMutation,
    useVerifyOtpMutation,
    useSignupMutation,
    useLoginMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyTokenMutation
} = userApiSlice;