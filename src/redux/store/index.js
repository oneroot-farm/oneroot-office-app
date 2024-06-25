import { configureStore } from "@reduxjs/toolkit";

// api
import { api } from "@/redux/api";

// slice
import userReducer from "@/redux/slice/user";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,

    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
