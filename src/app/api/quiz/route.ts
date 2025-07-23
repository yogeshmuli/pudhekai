import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadJson(filename: string) {
  const jsonPath = path.join(process.cwd(), "src/services/" + filename);
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

function selectPerGroup<T>(items: T[], groupKey: string, nPerGroup: number): T[] {
  const grouped: { [key: string]: T[] } = {};
  items.forEach(q => {
    const key = (q as any)[groupKey];
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

/**
 * @openapi
 * /api/quiz:
 *   post:
 *     summary: Generate a randomized quiz for a given test and assessment type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               test:
 *                 type: string
 *                 enum: [hexaco, riasec, mi, nih, learningstyle, reasoning, family]
 *               assessmentType:
 *                 type: string
 *                 enum: [free, paid]
 *     responses:
 *       200:
 *         description: Randomized quiz questions
 */
export async function POST(request: Request) {
  try {
    const { test, assessmentType } = await request.json();
    const type = (assessmentType === "paid") ? "paid" : "free";
    let questions: any[] = [];

    switch (test) {
      case "hexaco": {
        const all = loadJson("hexaco_questions.json");
        const n = type === "paid" ? 10 : 4;
        questions = selectPerGroup(all, "trait", n);
        break;
      }
      case "riasec": {
        const all = loadJson("riasec_questions.json");
        const n = type === "paid" ? 5 : 2;
        questions = selectPerGroup(all, "category", n);
        break;
      }
      case "mi": {
        const all = loadJson("mi_questions.json");
        // Always 5 per intelligence, both free and paid
        questions = selectPerGroup(all, "intelligence", 5);
        break;
      }
      case "nih": {
        const all = loadJson("nih_questions.json");
        const n = type === "paid" ? 2 : 1;
        questions = selectPerGroup(all, "domain", n);
        break;
      }
      case "learningstyle": {
        const all = loadJson("learningstyle_questions.json");
        const n = type === "paid" ? 3 : 2;
        questions = selectPerGroup(all, "style", n);
        break;
      }
      case "reasoning": {
        const all = loadJson("reasoning_questions.json");
        const n = type === "paid" ? 2 : 1;
        questions = selectPerGroup(all, "domain", n);
        break;
      }
      case "family": {
        const all = loadJson("familiy_questions.json");
        questions = shuffle(all);
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid test type" }, { status: 400 });
    }

    // Shuffle the final question order
    questions = shuffle(questions);
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 