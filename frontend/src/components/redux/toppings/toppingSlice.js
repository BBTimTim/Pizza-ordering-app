import { apiSlice } from "../../../app/api/apiSlice";

export const toppingSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getToppings: builder.query({
      query: () => "/toppings",
      providesTags: ["Toppings"],
    }),

    addTopping: builder.mutation({
      query: (topping) => ({
        url: "/addtoppings",
        method: "POST",
        body: topping,
      }),
    }),

    updateTopping: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/toppings/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Toppings"],
    }),

    removeTopping: builder.mutation({
      query: (id) => ({
        url: `/toppings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Toppings"],
    }),
  }),
});

export const {
  useGetToppingsQuery,
  useAddToppingMutation,
  useUpdateToppingMutation,
  useRemoveToppingMutation,
} = toppingSlice;