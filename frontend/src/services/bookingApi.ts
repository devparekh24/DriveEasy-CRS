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

const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token

export const bookingApi = createApi({
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
