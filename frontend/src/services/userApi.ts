import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../slices/userSlice";

const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token;

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000',
        prepareHeaders: (headers) => {
            const authToken = getAuthToken();
            if (authToken) {
                headers.set('Authorization', `Bearer ${authToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({

        getAllUsers: builder.query<User[], void>({
            query: () => ({
                url: '/users'
            }),
            providesTags: ['User']
        }),
        getUser: builder.query<User, string>({
            query: (userId) => ({
                url: `/users/${userId}`
            }),
            providesTags: ['User']
        }),
        updateUser: builder.mutation<User, { userId: string; updatedUser: Partial<User> }>({
            query: ({ userId, updatedUser }) => ({
                url: `/users/${userId}`,
                method: 'PATCH',
                body: updatedUser
            }),
            invalidatesTags: ['User']
        }),
        removeUser: builder.mutation<void, string>({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User']
        }),
    })
})

export const {
    useGetAllUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation,
    useRemoveUserMutation } = userApi