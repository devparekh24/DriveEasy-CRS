import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Car } from "../slices/carSlice";


const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token

export const carApi = createApi({
    reducerPath: 'carApi',
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
    tagTypes: ['Car'],
    endpoints: (builder) => ({

        getAllCars: builder.query<Car[], void>({
            query: () => ({
                url: '/cars'
            }),
            providesTags: ['Car']
        }),
        getCar: builder.query<Car, string>({
            query: (carId) => ({
                url: `/cars/${carId}`
            }),
            providesTags: ['Car']
        }),
        addCar: builder.mutation<Car, Partial<Car>>({
            query: (newCar) => ({
                url: '/cars',
                method: 'POST',
                body: newCar,
            }),
            invalidatesTags: ['Car']
        }),
        updateCar: builder.mutation<Car, { carId: string; updatedCar: Partial<Car> }>({
            query: ({ carId, updatedCar }) => ({
                url: `/cars/${carId}`,
                method: 'PATCH',
                body: updatedCar
            }),
            invalidatesTags: ['Car']
        }),
        removeCar: builder.mutation<void, string>({
            query: (carId) => ({
                url: `/cars/${carId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Car']
        }),
    })
})

export const {
    useGetAllCarsQuery,
    useGetCarQuery,
    useAddCarMutation,
    useUpdateCarMutation,
    useRemoveCarMutation } = carApi