import { apiSlice } from "../../../app/api/apiSlice";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

getProducts: builder.query({
  query: (page = 1) => `/products?page=${page}`,
  providesTags: (result) =>
    result?.data.data
      ? [
          ...result.data.data.map(({ id }) => ({
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

searchData: builder.query({
  query: ({ search, page = 1 }) =>
    `/products-result?search=${encodeURIComponent(search)}&page=${page}`,

  providesTags: ["Products"],
}),

addProduct: builder.mutation({
      query: (product) => ({
        url: "/addproducts",
        method: "POST",
        body: product,
      }),
       invalidatesTags: ["Products"],
    }),

updateProduct: builder.mutation({
  query: ({ id, body }) => ({
    url: `/editproduct/${id}`,
    method: "POST",
    body
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
  useSearchDataQuery,
} = productSlice;