import { apiSlice } from '../../app/api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ["Users"],
        }),

        getUser: builder.query({
            query: id => `/users/${id}`,
        }),

        updateUser: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body,
            }),
             invalidatesTags: ["Users"],
        }),

        deleteUser: builder.mutation({
            query: id => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
             invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApiSlice;