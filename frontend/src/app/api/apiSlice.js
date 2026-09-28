import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
   // Dockerben "/api" (lásd docker/web/Dockerfile)
   baseUrl: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',

   prepareHeaders: (headers, {getState}) => {
    const token = getState().auth.token
    if(token) {
        headers.set("authorization", `Bearer ${token}`)
    }
    return headers;
   }
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
});

