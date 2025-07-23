import { NextResponse } from "next/server";
import { getMIResult, UserResponses } from "../../../services/miScoring";

export async function POST(request: Request) {
  try {
    const { responses } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }

    const miScores = getMIResult(responses as UserResponses);
    return NextResponse.json({ miScores });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 