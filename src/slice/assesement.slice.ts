import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testName: "",
  assessmentType: "",
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setTestName: (state, action) => {
      state.testName = action.payload;
    },
  },
});

export const { setTestName } = assessmentSlice.actions;
export default assessmentSlice.reducer;
