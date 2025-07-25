import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { scoreAptitudeTest } from '../../../services/aptitude Scoring';

/**
 * @swagger
 * /api/aptitude:
 *   get:
 *     summary: Get all aptitude test questions
 *     tags:
 *       - Assessment & Results
 *     description: Retrieves all aptitude test questions without answer indices for client-side display
 *     responses:
 *       200:
 *         description: List of aptitude questions (without answers)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique question identifier
 *                   type:
 *                     type: string
 *                     description: Question category (pattern_recognition, logical_reasoning, numerical_reasoning, critical_reasoning)
 *                   question:
 *                     type: string
 *                     description: The question text
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Available answer options
 *             example:
 *               - id: "pr1"
 *                 type: "pattern_recognition"
 *                 question: "Which number comes next in the series? 2, 4, 8, 16, ___"
 *                 options: ["18", "24", "32", "20"]
 *   post:
 *     summary: Calculate aptitude test score
 *     tags:
 *       - Assessment & Results
 *     description: Calculates and returns the score for aptitude test responses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               responses:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 *                 description: User responses with question ID as key and selected option index as value
 *           example:
 *             responses:
 *               pr1: 2
 *               lr1: 1
 *               nr1: 3
 *               cr1: 0
 *     responses:
 *       200:
 *         description: Scoring result with category breakdown and overall score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: object
 *                   description: Score breakdown by question category
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       correct:
 *                         type: integer
 *                       total:
 *                         type: integer
 *                       percent:
 *                         type: integer
 *                       label:
 *                         type: string
 *                 totalScore:
 *                   type: integer
 *                   description: Total correct answers
 *                 totalQuestions:
 *                   type: integer
 *                   description: Total number of questions
 *                 totalPercent:
 *                   type: integer
 *                   description: Overall percentage score
 *                 summary:
 *                   type: string
 *                   description: Human-readable summary of results
 *             example:
 *               categories:
 *                 pattern_recognition:
 *                   correct: 8
 *                   total: 10
 *                   percent: 80
 *                   label: "High"
 *                 logical_reasoning:
 *                   correct: 7
 *                   total: 10
 *                   percent: 70
 *                   label: "Moderate"
 *               totalScore: 30
 *               totalQuestions: 40
 *               totalPercent: 75
 *               summary: "pattern recognition: 8/10 (High), logical reasoning: 7/10 (Moderate)"
 */
export async function GET() {
  const filePath = path.join(process.cwd(), 'src/data/aptitude_questions.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const questions = JSON.parse(fileContents);
  const sanitizedQuestions = (questions as Array<Record<string, unknown>>).map(({ answerIndex, ...rest }) => rest);
  return NextResponse.json(sanitizedQuestions);
}

export async function POST(request: Request) {
  const filePath = path.join(process.cwd(), 'src/data/aptitude_questions.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const questions = JSON.parse(fileContents);
  // Only use id, type, and answerIndex for scoring
  const questionBank = questions.map((q: any) => ({ id: q.id, type: q.type, answerIndex: q.answerIndex }));
  const body = await request.json();
  const responses = body.responses;
  const result = scoreAptitudeTest(questionBank, responses);
  return NextResponse.json(result);
}
