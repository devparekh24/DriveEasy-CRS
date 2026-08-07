import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "../slices/orderSlice";


const getAuthToken = () => {
    try {
        const item = localStorage.getItem('user');
        return item ? JSON.parse(item)?.token : null;
    } catch {
        return null;
    }
};

const getUserId = () => {
    try {
        const item = localStorage.getItem('user');
        if (!item) return null;
        const parsed = JSON.parse(item);
        return parsed?.userId || parsed?.user?._id || parsed?.id || null;
    } catch {
        return null;
    }
};

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers) => {
            const authToken = getAuthToken();
            if (authToken) {
                headers.set('Authorization', `Bearer ${authToken}`);
                const userId = getUserId();
                if (userId) {
                    headers.set('X-User-Id', userId);
                }
            }
            return headers;
        },
    }),
    tagTypes: ['Order'],
    endpoints: (builder) => ({

        getAllOrders: builder.query<Order[], void>({
            query: () => ({
                url: '/orders'
            }),
            providesTags: ['Order']
        }),
        getOrder: builder.query<Order, string>({
            query: (orderId) => ({
                url: `/orders/${orderId}`
            }),
            providesTags: ['Order']
        }),
        getUserOrders: builder.query<Order[], void>({
            query: () => ({
                url: `/orders/mybookings`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),
        addOrder: builder.mutation<Order, { carId: string, newOrder: Partial<Order> }>({
            query: ({ carId, newOrder }) => ({
                url: '/orders',
                method: 'POST',
                body: {
                    car: carId,
                    ...newOrder
                },
            }),
            invalidatesTags: ['Order']
        }),
        updateOrder: builder.mutation<Order, { orderId: string; updatedOrder: Partial<Order> }>({
            query: ({ orderId, updatedOrder }) => ({
                url: `/orders/${orderId}`,
                method: 'PATCH',
                body: updatedOrder
            }),
            invalidatesTags: ['Order']
        }),
        removeOrder: builder.mutation<void, string>({
            query: (orderId) => ({
                url: `/orders/${orderId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order']
        }),
    })
})

export const {
    useGetAllOrdersQuery,
    useGetOrderQuery,
    useGetUserOrdersQuery,
    useUpdateOrderMutation,
    useAddOrderMutation,
    useRemoveOrderMutation } = orderApi