import Cookies from "js-cookie";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;
      state.data = userData;
      Cookies.set("user", JSON.stringify(userData));
    },
    updateUser: (state, action) => {
      const updates = action.payload;
      state.data = { ...state.data, ...updates };
      Cookies.set("user", JSON.stringify(state.data));
    },
    logoutUser: (state) => {
      state.data = null;
      Cookies.remove("user");
    },
  },
});

export const { setUser, updateUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
