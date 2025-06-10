import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ContactQuery } from "../slices/contactQuerySlice";
import { RootState } from "../store/store";

export const contactQueryApi = createApi({
    reducerPath: 'contactQueryApi',
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
    tagTypes: ['ContactQuery'],
    endpoints: (builder) => ({

        getAllContactQueries: builder.query<ContactQuery[], void>({
            query: () => ({
                url: '/contact-queries'
            }),
            providesTags: ['ContactQuery']
        }),
        getContactQuery: builder.query<ContactQuery, string>({
            query: (cqId) => ({
                url: `/contact-queries/${cqId}`
            }),
            providesTags: ['ContactQuery']
        }),
        addContactQuery: builder.mutation<ContactQuery, Partial<ContactQuery>>({
            query: (newCQ) => ({
                url: '/contact-queries',
                method: 'POST',
                body: newCQ,
            }),
            invalidatesTags: ['ContactQuery']
        }),
        updateContactQuery: builder.mutation<ContactQuery, { cqId: string; updatedContactQuery: Partial<ContactQuery> }>({
            query: ({ cqId, updatedContactQuery }) => ({
                url: `/contact-queries/${cqId}`,
                method: 'PATCH',
                body: updatedContactQuery
            }),
            invalidatesTags: ['ContactQuery']
        }),
        removeContactQuery: builder.mutation<void, string>({
            query: (cqId) => ({
                url: `/contact-queries/${cqId}`,
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