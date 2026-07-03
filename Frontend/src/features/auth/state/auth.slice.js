import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    err: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setErr: (state, action) => {
      state.err = action.payload;
    },
  },
});

export const { setErr, setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;