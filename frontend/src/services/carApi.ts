import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Car } from "../slices/carSlice";

export const carApi = createApi({
    reducerPath: 'carApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000'
    }),

    endpoints: (builder) => ({

        getAllCars: builder.query<Car[], void>({
            query: () => ({
                url: '/cars'
            }),
        }),
        getCar: builder.query<Car, string>({
            query: (carId) => ({
                url: `/cars/${carId}`
            }),
        }),
        addCar: builder.mutation<Car, Partial<Car>>({
            query: (newCar) => ({
                url: '/cars',
                method: 'POST',
                body: newCar,
            }),
        }),
        updateCar: builder.mutation<Car, { carId: string; updatedCar: Partial<Car> }>({
            query: ({ carId, updatedCar }) => ({
                url: `/cars/${carId}`,
                method: 'PATCH',
                body: updatedCar
            }),
        }),
        removeCar: builder.mutation<void, string>({
            query: (carId) => ({
                url: `/cars/${carId}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const {
    useGetAllCarsQuery,
    useGetCarQuery,
    useAddCarMutation,
    useUpdateCarMutation,
    useRemoveCarMutation } = carApi