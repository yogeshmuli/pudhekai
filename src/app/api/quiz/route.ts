/**
 * @openapi
 * /api/quiz:
 *   get:
 *     summary: Generate a randomized quiz for a given test and assessment type
 *     parameters:
 *       - in: query
 *         name: test
 *         schema:
 *           type: string
 *           enum: [hexaco, riasec, mi, nih, learningstyle, reasoning, family]
 *         required: true
 *         description: The quiz/test type
 *       - in: query
 *         name: assessmentType
 *         schema:
 *           type: string
 *           enum: [free, paid]
 *         required: false
 *         description: Assessment tier (ignored for family quiz)
 *     responses:
 *       200:
 *         description: Randomized quiz questions
 */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getMIResult, getNIHResult, getLearningStyleResult, getReasoningResult } from "../../../services/miScoring";
import { getHexacoResult } from "../../../services/hexacoScoring";
import { getRiasecResult } from "../../../services/riasecScoring";
import { db } from "../../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadJson(filename: string): any[] {
  const jsonPath = path.join(process.cwd(), "src/services/" + filename);
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

function selectPerGroup<T extends Record<string, any>>(items: T[], groupKey: string, nPerGroup: number): T[] {
  const grouped: { [key: string]: T[] } = {};
  items.forEach((q: T) => {
    const key = q[groupKey];
    if (!key) return;
    grouped[key] = grouped[key] || [];
    grouped[key].push(q);
  });
  let selected: T[] = [];
  for (const key in grouped) {
    selected = selected.concat(shuffle(grouped[key]).slice(0, nPerGroup));
  }
  return selected;
}

// Helper to fetch questions from Firestore
async function fetchQuestionsFromFirestore(collectionName: string): Promise<any[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');
    const assessmentType = searchParams.get('assessmentType');
    const type = (assessmentType === "paid") ? "paid" : "free";
    let questions = [];

    switch (test) {
      case "hexaco": {
        questions = await fetchQuestionsFromFirestore("questions_hexaco");
        break;
      }
      case "riasec": {
        questions = await fetchQuestionsFromFirestore("questions_riasec");
        break;
      }
      case "mi": {
        questions = await fetchQuestionsFromFirestore("questions_mi");
        break;
      }
      case "nih": {
        questions = await fetchQuestionsFromFirestore("questions_nih");
        break;
      }
      case "learningstyle": {
        questions = await fetchQuestionsFromFirestore("questions_learningstyle");
        break;
      }
      case "reasoning": {
        questions = await fetchQuestionsFromFirestore("questions_reasoning");
        break;
      }
      // For family, you may need a similar Firestore fetch if migrated
      default:
        return NextResponse.json({ error: "Invalid test type" }, { status: 400 });
    }

    // Optionally shuffle questions here if needed
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 