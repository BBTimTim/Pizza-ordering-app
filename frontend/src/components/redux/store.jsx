import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import cartReducer from "./cart/cartSlice.jsx";
import { apiSlice } from "../../app/api/apiSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,

    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;