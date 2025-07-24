import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchQuizQuestions = createAsyncThunk(
  "quiz/fetchQuestions",
  async (params: { test: string; assessmentType: string }) => {
    const { test, assessmentType } = params;
    const response = await fetch(
      `/api/quiz?test=${test}&assessmentType=${assessmentType}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch quiz questions");
    }
    const data = await response.json();
    return data;
  }
);
