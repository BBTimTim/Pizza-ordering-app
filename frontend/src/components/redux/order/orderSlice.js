import { apiSlice } from "../../../app/api/apiSlice";


export const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

getOrders: builder.query({
  query: () => "/orders",
  providesTags: (result) =>
    result?.data
      ? [
          ...result.data.map(({ id }) => ({
            type: "Orders",
            id,
          })),
          "Orders",
        ]
      : ["Orders"],
}),

getOrder: builder.query({
  query: (id) => `/orders/${id}`,
  providesTags: (result, error, id) => [
    { type: "Orders", id },
  ],
}),

addOrder: builder.mutation({
      query: (product) => ({
        url: "/addorder",
        method: "POST",
        body: product,
      }),
       invalidatesTags: ["Orders"],
    }),

updateOrder: builder.mutation({
  query: ({ id, body }) => ({
    url: `/editorder/${id}`,
    method: "POST",
    body
  }),

  invalidatesTags: (result, error, { id }) => [
    { type: "Orders", id },
    "Orders",
  ],
}),

removeOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
       invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useRemoveOrderMutation
} = orderSlice;