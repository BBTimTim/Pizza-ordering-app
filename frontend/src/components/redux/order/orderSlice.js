import { apiSlice } from "../../../app/api/apiSlice";


export const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

// Admin: összes rendelés, opcionális státuszszűrővel (lapozott válasz)
getOrders: builder.query({
  query: ({ status = "", page = 1 } = {}) => ({
    url: "/orders",
    params: { page, ...(status && { status }) },
  }),
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

// Bejelentkezett vásárló saját rendelései
getMyOrders: builder.query({
  query: () => "/my-orders",
  providesTags: ["MyOrders"],
}),

// Rendelés létrehozása: a szerver számolja az árat, és Stripe client_secret-et ad vissza
checkout: builder.mutation({
      query: (order) => ({
        url: "/checkout",
        method: "POST",
        body: order,
      }),
    }),

confirmPayment: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/confirm-payment`,
        method: "POST",
      }),
       invalidatesTags: ["Orders", "MyOrders"],
    }),

updateOrderStatus: builder.mutation({
  query: ({ id, status }) => ({
    url: `/orders/${id}/status`,
    method: "POST",
    body: { status },
  }),

  invalidatesTags: (result, error, { id }) => [
    { type: "Orders", id },
    "Orders",
    "MyOrders",
  ],
}),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetMyOrdersQuery,
  useCheckoutMutation,
  useConfirmPaymentMutation,
  useUpdateOrderStatusMutation,
} = orderSlice;
