import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Car } from "../slices/carSlice";
import { RootState } from "../store/store";


// const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token

export const carApi = createApi({
    reducerPath: 'carApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const isAdmin = (getState() as RootState).auth.isAdmin;
            if (isAdmin) {
                const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token
                const authToken = getAuthToken();
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
        getAvailableCars: builder.query<Car[], { pickupDate?: string; dropOffDate?: string }>({
            query: ({ pickupDate, dropOffDate }) => ({
                url: '/cars/available-cars',
                params: { pickupDate, dropOffDate },
            }),
            providesTags: ['Car'],
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
                method: 'PUT',
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
        uploadCarImage: builder.mutation<Car, { carId: string; file: File }>({
            query: ({ carId, file }) => ({
                url: `/cars/${carId}/img-upload`,
                method: 'PUT',
                body: file
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
    useRemoveCarMutation,
    useUploadCarImageMutation,
    useGetAvailableCarsQuery,
} = carApi