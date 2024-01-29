import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000'
    }),

    endpoints: (builder) => ({

        login: builder.mutation({
            query: (body: { email: string, password: string }) => ({
                url: '/login',
                method: 'POST',
                body,
            })
        }),

        signup: builder.mutation({
            query: (body: { name: string, email: string, password: string, confirmPassword: string }) => ({
                url: '/signup',
                method: 'POST',
                body,
            })
        })
    })
})

export const { useLoginMutation, useSignupMutation } = authApi