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
        case "riasec":
          const riasecResponse = await fetch("/api/riasec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              responses: payload.responses,
              assessmentType: payload.assessmentType,
            }),
          });
          if (!riasecResponse.ok) {
            throw new Error("Failed to submit RIASEC assessment");
          }
          return await riasecResponse.json();
        case "mi":
          const miResponse = await fetch("/api/mi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              responses: payload.responses,
              assessmentType: payload.assessmentType,
            }),
          });
          if (!miResponse.ok) {
            debugger;
            throw new Error(
              "Failed to submit Multiple Intelligence assessment"
            );
          }
          return await miResponse.json();
        case "aptitude":
          const aptitudeResponse = await fetch("/api/aptitude", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              responses: payload.responses,
              assessmentType: payload.assessmentType,
            }),
          });
          if (!aptitudeResponse.ok) {
            throw new Error("Failed to submit Aptitude assessment");
          }
          return await aptitudeResponse.json();
        case "family":
          const familyResponse = await fetch("/api/family", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              responses: payload.responses,
              assessmentType: payload.assessmentType,
            }),
          });
          if (!familyResponse.ok) {
            throw new Error("Failed to submit Family assessment");
          }
          return await familyResponse.json();

        default:
          throw new Error("Unsupported test name");
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to submit assessment");
    }
  }
);
