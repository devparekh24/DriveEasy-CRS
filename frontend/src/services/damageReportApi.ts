import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DamageReport } from "../slices/damageReportSlice";

const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token

export const damageReportApi = createApi({
    reducerPath: 'damageReportApi',
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
    tagTypes: ['DamageReport'],
    endpoints: (builder) => ({

        getAllDamageReports: builder.query<DamageReport[], void>({
            query: () => ({
                url: '/damage-reports'
            }),
            providesTags: ['DamageReport']
        }),
        getDamageReport: builder.query<DamageReport, string>({
            query: (drId) => ({
                url: `/damage-reports/${drId}`
            }),
            providesTags: ['DamageReport']
        }),
        addDamageReport: builder.mutation<DamageReport, Partial<DamageReport>>({
            query: (newDR) => ({
                url: '/damage-reports',
                method: 'POST',
                body: newDR,
            }),
            invalidatesTags: ['DamageReport']
        }),
        updateDamageReport: builder.mutation<DamageReport, { drId: string; updatedDamageReport: Partial<DamageReport> }>({
            query: ({ drId, updatedDamageReport }) => ({
                url: `/damage-reports/${drId}`,
                method: 'PATCH',
                body: updatedDamageReport
            }),
            invalidatesTags: ['DamageReport']
        }),
        removeDamageReport: builder.mutation<void, string>({
            query: (drId) => ({
                url: `/damage-reports/${drId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DamageReport']
        }),
    })
})

export const {
    useGetAllDamageReportsQuery,
    useGetDamageReportQuery,
    useAddDamageReportMutation,
    useUpdateDamageReportMutation,
    useRemoveDamageReportMutation
} = damageReportApi