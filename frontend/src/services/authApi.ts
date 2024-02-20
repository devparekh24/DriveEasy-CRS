import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000'
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
        })
    })
})

export const { useLoginMutation, useSignupMutation } = authApi