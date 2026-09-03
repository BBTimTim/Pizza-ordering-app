import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import productSlice from "./productSlice.jsx";
import { apiSlice } from "../../app/api/apiSlice.js";
//import  cartSlice from "./cartSlice.jsx";

const store = configureStore({
    reducer: {
     products: productSlice,
   //   cart: cartSlice,
     auth: authReducer,
     [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware => 
     getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;