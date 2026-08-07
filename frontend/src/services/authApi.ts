import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAuthToken = () => {
    try {
        const item = localStorage.getItem('user');
        return item ? JSON.parse(item)?.token : null;
    } catch {
        return null;
    }
};

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
        credentials: 'include',
        prepareHeaders: (headers) => {
            const authToken = getAuthToken();
            if (authToken) {
                headers.set('Authorization', `Bearer ${authToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({

        login: builder.mutation({
            query: (body: { email: string, password: string }) => ({
                url: '/login',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth']
        }),

        signup: builder.mutation({
            query: (body: { name: string, email: string, password: string, confirmPassword: string, contactNumber: number }) => ({
                url: '/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth']
        }),

        forgotPassword: builder.mutation({
            query: (body: { email: string }) => ({
                url: '/forgot-password',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth']
        }),

        resetPassword: builder.mutation({
            query: ({ token, password, confirmPassword }) => ({
                url: `/reset-password/${token}`,
                method: 'PATCH',
                body: {
                    password,
                    confirmPassword,
                },
            }),
            invalidatesTags: ['Auth']
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/users/logout',
                method: 'GET',
            }),
            invalidatesTags: ['Auth']
        }),
    })
})

export const { useLoginMutation, useSignupMutation, useForgotPasswordMutation, useResetPasswordMutation, useLogoutMutation } = authApi