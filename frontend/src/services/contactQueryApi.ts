import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ContactQuery } from "../slices/contactQuerySlice";

const getAuthToken = () => JSON.parse(localStorage.getItem('user')!).token

export const contactQueryApi = createApi({
    reducerPath: 'contactQueryApi',
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
    tagTypes: ['ContactQuery'],
    endpoints: (builder) => ({

        getAllContactQueries: builder.query<ContactQuery[], void>({
            query: () => ({
                url: '/contactQueries'
            }),
            providesTags: ['ContactQuery']
        }),
        getContactQuery: builder.query<ContactQuery, string>({
            query: (cqId) => ({
                url: `/contactQueries/${cqId}`
            }),
            providesTags: ['ContactQuery']
        }),
        addContactQuery: builder.mutation<ContactQuery, Partial<ContactQuery>>({
            query: (newCQ) => ({
                url: '/contactQueries',
                method: 'POST',
                body: newCQ,
            }),
            invalidatesTags: ['ContactQuery']
        }),
        updateContactQuery: builder.mutation<ContactQuery, { cqId: string; updatedContactQuery: Partial<ContactQuery> }>({
            query: ({ cqId, updatedContactQuery }) => ({
                url: `/contactQueries/${cqId}`,
                method: 'PATCH',
                body: updatedContactQuery
            }),
            invalidatesTags: ['ContactQuery']
        }),
        removeContactQuery: builder.mutation<void, string>({
            query: (cqId) => ({
                url: `/contactQueries/${cqId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ContactQuery']
        }),
    })
})

export const {
    useGetAllContactQueriesQuery,
    useGetContactQueryQuery,
    useAddContactQueryMutation,
    useUpdateContactQueryMutation,
    useRemoveContactQueryMutation
} = contactQueryApi