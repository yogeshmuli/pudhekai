import { createSlice } from "@reduxjs/toolkit";
import { login } from "../thunk/auth.thunk";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
    subscription: null as any,
  },
  reducers: {
    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { setSubscription, setAuthenticated, setLoading } = authSlice.actions;
export default authSlice.reducer;
