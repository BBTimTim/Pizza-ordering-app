import { apiSlice } from "../../../app/api/apiSlice";

export const sizeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query({
      query: () => "/sizes",
      providesTags: ["Sizes"],
    }),

    addSize: builder.mutation({
      query: (size) => ({
        url: "/addsizes",
        method: "POST",
        body: size,
      }),
      invalidatesTags: ["Sizes"],
    }),

    updateSize: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sizes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sizes"],
    }),

    removeSize: builder.mutation({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sizes"],
    }),
  }),
});

export const {
  useGetSizesQuery,
  useAddSizeMutation,
  useUpdateSizeMutation,
  useRemoveSizeMutation,
} = sizeSlice;