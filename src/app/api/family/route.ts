import { NextResponse } from "next/server";
import { summarizeFamilyProfile, FamilyContextResponse } from "../../../services/familyScoring";

export async function POST(request: Request) {
  try {
    const { responses } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }
    const summary = summarizeFamilyProfile(responses as FamilyContextResponse);
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 