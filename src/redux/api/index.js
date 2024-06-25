import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Utils
import { getUserToken } from "@/utils";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  reducerPath: "api",
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "api/login",
        method: "POST",
        body: {
          username,
          password,
        },
      }),
    }),
  }),
});

export const {
  // Auth
  useLoginMutation,
} = api;
