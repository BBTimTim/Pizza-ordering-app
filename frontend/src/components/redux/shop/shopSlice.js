import { apiSlice } from "../../../app/api/apiSlice";

export const shopSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

// Nyitvatartás: { open, message, hours: [{ day, hours }] }
getShopStatus: builder.query({
  query: () => "/shop-status",
}),
  }),
});

export const { useGetShopStatusQuery } = shopSlice;
