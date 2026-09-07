import { apiSlice } from "../../../app/api/apiSlice";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
  query: () => "/products",
  providesTags: (result) =>
    result
      ? [
          ...result.map(({ id }) => ({
            type: "Products",
            id,
          })),
          "Products",
        ]
      : ["Products"],
}),

getProduct: builder.query({
  query: (id) => `/products/${id}`,
  providesTags: (result, error, id) => [
    { type: "Products", id },
  ],
}),

addProduct: builder.mutation({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
       invalidatesTags: ["Products"],
    }),

updateProduct: builder.mutation({
  query: ({ id, body }) => ({
    url: `/products/${id}`,
    method: "POST",
    body,
  }),
  invalidatesTags: (result, error, { id }) => [
    { type: "Products", id },
    "Products",
  ],
}),

getFeaturedProducts: builder.query({
  query: () => "/featured-products",
  providesTags: ["Products"],
}),

removeProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
       invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useRemoveProductMutation,
} = productSlice;