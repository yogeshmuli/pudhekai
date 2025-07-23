import { NextResponse } from "next/server";
import { scoreHexaco, detectArchetype, hexacoQuestions, UserResponses } from "../../../services/hexacoScoring";

export async function POST(request: Request) {
  try {
    const { responses } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }

    const traitScores = scoreHexaco(hexacoQuestions, responses as UserResponses);
    const archetype = detectArchetype(traitScores);

    return NextResponse.json({ traitScores, archetype });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 