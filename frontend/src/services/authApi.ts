import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi: any = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/'
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body: { email: string, password: string }) => ({
                url: '/login',
                method: 'POST',
                body,
            })
        })
    })
})

export const { useLoginMutation } = authApi