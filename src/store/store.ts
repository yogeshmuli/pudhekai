import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/auth.slice";
import assessmentReducer from "../slice/assesement.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assessment: assessmentReducer,
    // Add your reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
