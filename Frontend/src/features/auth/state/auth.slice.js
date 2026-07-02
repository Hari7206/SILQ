import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false ,
    err: null
  },
  reducers: {
        setUser: (state , action ) => {
            state.user = action.payload
        } ,
        setLoading: (state , action ) => {
            state.user = action.payload
        } ,
        setErr: ( state , action ) => {
            state.user = action.payload
        }
  },
});

export const { setErr , setLoading , setUser } = authSlice.actions;
export default authSlice.reducer;