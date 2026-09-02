import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";

import productSlice from "./productSlice.jsx";
import { apiSlice } from "../../app/api/apiSlice.js";

const store = configureStore({
    reducer: {

     product: productSlice,
     auth: authReducer,
     [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware => 
     getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;