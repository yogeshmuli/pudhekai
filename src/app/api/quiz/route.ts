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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');
    const assessmentType = searchParams.get('assessmentType');
    const type = (assessmentType === "paid") ? "paid" : "free";
    let questions = [];

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

    questions = shuffle(questions);
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 