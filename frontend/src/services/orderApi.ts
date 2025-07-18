import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "../slices/orderSlice";


const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token;
const getUserId = () => JSON.parse(localStorage.getItem('user')!).id;

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