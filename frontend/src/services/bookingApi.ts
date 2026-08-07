import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface BookingData {
    fullName: string;
    emailAddress: string;
    phoneNo: string;
    pickupAddress: string;
    pickupDate: string;
    pickupTime: string;
    dropOffAddress: string;
    dropOffDate: string;
    dropOffTime: string;
    totalAmount: string;
}

const getAuthToken = () => {
    try {
        const item = localStorage.getItem('user');
        return item ? JSON.parse(item)?.token : null;
    } catch {
        return null;
    }
};

export const bookingApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const authToken = getAuthToken();
            if (authToken) {
                headers.set('Authorization', `Bearer ${authToken}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        bookCar: builder.mutation<void, { carId: string; bookingData: BookingData }>({
            query: ({ carId, bookingData }) => ({
                url: `/orders/bookCar/${carId}`,
                method: 'POST',
                body: bookingData,
            }),
        }),
    }),
});

export const { useBookCarMutation } = bookingApi;
