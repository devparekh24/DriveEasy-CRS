import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../slices/userSlice";

const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token;

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
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
        getUser: builder.mutation<User, string>({
            query: (userId) => ({
                url: `/users/${userId}`
            }),
            invalidatesTags: ['User']
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
        updateMe: builder.mutation({
            query: (body: { name: string, email: string, contactNumber: number, currentPassword: string, password: string, confirmPassword: string }) => ({
                url: '/users/updateMe',
                method: 'PATCH',
                body,
            })
        }),
    })
})

export const {
    useGetAllUsersQuery,
    useGetUserMutation,
    useUpdateUserMutation,
    useUpdateMeMutation,
    useRemoveUserMutation } = userApi