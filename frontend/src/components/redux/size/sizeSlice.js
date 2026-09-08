import { apiSlice } from "../../../app/api/apiSlice";

export const sizeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query({
      query: () => "/sizes",
    }),

    addSize: builder.mutation({
      query: (size) => ({
        url: "/addsizes",
        method: "POST",
        body: size,
      }),
    }),

    updateSize: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sizes/${id}`,
        method: "PATCH",
        body,
      }),
    }),

    removeSize: builder.mutation({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSizesQuery,
  useAddSizeMutation,
  useUpdateSizeMutation,
  useRemoveSizeMutation,
} = sizeSlice;