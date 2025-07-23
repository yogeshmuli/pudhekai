import { NextResponse } from "next/server";
import { getRiasecResult, UserResponses } from "../../../services/riasecScoring";

export async function POST(request: Request) {
  try {
    const { responses, assessmentType } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }

    const { categoryScores, questionsUsed } = getRiasecResult(
      responses as UserResponses,
      assessmentType || "free"
    );

    return NextResponse.json({ categoryScores, questionsUsed });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 