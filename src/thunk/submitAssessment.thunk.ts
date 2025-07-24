import { createAsyncThunk } from "@reduxjs/toolkit";

interface SubmitAssessmentPayload {
  responses: { [id: string]: number | null };
  assessmentType: string;
  testName: string;
}

export const submitAssessmentResponse = createAsyncThunk(
  "assessment/submitResponse",
  async (payload: SubmitAssessmentPayload, { rejectWithValue }) => {
    try {
      switch (payload.testName) {
        case "hexaco":
          const hexacoResponse = await fetch("/api/hexaco", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              responses: payload.responses,
              assessmentType: payload.assessmentType,
            }),
          });
          if (!hexacoResponse.ok) {
            throw new Error("Failed to submit HEXACO assessment");
          }
          return await hexacoResponse.json();

        default:
          throw new Error("Unsupported test name");
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to submit assessment");
    }
  }
);
