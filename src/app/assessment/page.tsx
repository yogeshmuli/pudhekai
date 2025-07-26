"use client";
import React, { use, useEffect, useState } from "react";
import ProgressBar from "@app/components/progressBar";
import { fetchQuizQuestions } from "@app/thunk/quiz.thunk"
import { submitAssessmentResponse } from "@app/thunk/submitAssessment.thunk";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { toast, Toaster } from "react-hot-toast"; // Add this import
import { useRouter, useSearchParams } from "next/navigation";
import DashboardHeader from "@app/components/header/dashboardheader";
import { setTestName } from "@app/slice/assesement.slice";


function QuizProgress({ current, total }: { current: number; total: number }) {
    const percent = Math.round((current / total) * 100);
    return (
        <div id="quiz-progress" className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                    Question {current} of {total}
                </span>
                <span className="text-sm text-gray-500">{percent}% Complete</span>
            </div>
            <ProgressBar
                percent={percent}
                barClass="bg-primary h-2 rounded-full"
                labelClass="text-xs text-gray-500"
            />
        </div>
    );
}

function QuestionCard({
    question,
    description,
    options,
    selected,
    onSelect,
}: {
    question: string;
    description: string;
    options: { label: string; description: string; value: number }[];
    selected: number | null;
    onSelect: (idx: number) => void;
}) {
    return (
        <div id="quiz-card" className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div id="question-section" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{question}</h2>
                <p className="text-gray-600 mb-6">{description}</p>
            </div>
            <div id="options-section" className="space-y-4">
                {options.map((opt, idx) => (
                    <div
                        key={idx}
                        className={`option-card p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${selected === opt.value
                            ? "border-primary bg-blue-50"
                            : "border-gray-200 hover:border-primary hover:bg-blue-50"
                            }`}
                        onClick={() => onSelect(idx)}
                    >
                        <div
                            className={`w-5 h-5 border-2 rounded-full mr-4 flex items-center justify-center ${selected === opt.value ? "border-primary" : "border-gray-300"
                                }`}
                        >
                            <div
                                className={`w-2 h-2 bg-primary rounded-full ${selected === opt.value ? "" : "hidden"
                                    }`}
                            ></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{opt.label}</h3>
                            <p className="text-sm text-gray-600">{opt.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function QuestionIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div id="question-indicator" className="flex space-x-2">
            {Array.from({ length: total }).map((_, idx) => (
                <div
                    key={idx}
                    className={`w-3 h-3 rounded-full ${idx < current ? "bg-primary" : "bg-gray-300"
                        }`}
                ></div>
            ))}
        </div>
    );
}
type Question = {
    id: string;
    question: string;
    description: string;
    options: { label: string; description: string; value: number }[];
};

export default function Assessment() {
    const [current, setCurrent] = useState(1);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    // answers is now an object: { [questionId]: number | null }
    const [answers, setAnswers] = useState<{ [id: string]: number | null }>({});
    const dispatch = useAppDispatch();
    const router = useRouter();

    const assesmentType = "free";
    const testName = useAppSelector((state) => state.assessment.testName); // Default to "hexaco" if not set

    console.log("Answers state:", answers);

    useEffect(() => {
        if (!testName) {
            // If no test is selected, start with family background
            dispatch(setTestName("family"));
        }
        checkSubscription();
    }, []);

    const checkSubscription = async () => {
        try {
            const response = await fetch('/api/subscription/current');
            if (response.ok) {
                setHasSubscription(true);
                fetchQuestions();
            } else {
                // No active subscription, redirect to tier selection
                // also send the searchParams as its to the 
                router.push(`/tier-selection/?test=${testName}`)
                return;
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
            // On error, redirect to tier selection
            window.location.href = '/tier-selection';
            return;
        } finally {
            setIsCheckingSubscription(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            console.log('Fetching questions for test:', testName, 'assessmentType:', assesmentType);
            
            const response = await dispatch(fetchQuizQuestions({
                test: testName,
                assessmentType: assesmentType
            })).unwrap();

            console.log('Raw questions response:', response);

            const mappedQuestions: Question[] = response.questions.map((q: any) => {
                // Handle different question types
                if (testName === "family") {
                    // Family questions have different structure
                    console.log('Mapping family question:', q);
                    return {
                        id: q.id,
                        question: q.text,
                        description: `Domain: ${q.domain}`,
                        options: q.options.map((option: string, index: number) => ({
                            label: option,
                            description: option,
                            value: index + 1
                        }))
                    };
                } else {
                    // HEXACO and other personality tests
                    console.log('Mapping personality question:', q);
                    return {
                        id: q.id,
                        question: q.text,
                        description: `Facet: ${q.facet || 'N/A'}, Trait: ${q.trait || 'N/A'}`,
                        options: [
                            { label: "Strongly Disagree", description: "I do not relate to this at all.", value: 1 },
                            { label: "Disagree", description: "I somewhat relate to this.", value: 2 },
                            { label: "Neutral", description: "I neither agree nor disagree.", value: 3 },
                            { label: "Agree", description: "I mostly relate to this.", value: 4 },
                            { label: "Strongly Agree", description: "I completely relate to this.", value: 5 },
                        ],
                    };
                }
            });
            
            console.log('Mapped questions:', mappedQuestions);
            setQuestions(mappedQuestions);

            // Initialize answers as { [id]: null }
            const initialAnswers: { [id: string]: number | null } = {};
            mappedQuestions.forEach(q => {
                initialAnswers[q.id] = null;
            });
            setAnswers(initialAnswers);

        } catch (error) {
            console.error("Error fetching questions:", error);
            toast.error("Failed to load questions. Please try again.");
        }
    };

    // Handle selection: update answers object with selected value for current question
    const handleSelect = (optionIdx: number) => {
        const questionId = questions[current - 1]?.id;
        if (!questionId) return;
        const selectedValue = questions[current - 1].options[optionIdx].value;
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedValue
        }));
    };

    const handleNext = () => {
        const questionId = questions[current - 1]?.id;
        if (!questionId || answers[questionId] === null) {
            toast.error("Please select an answer before proceeding.");
            return;
        }
        if (current < questions.length) setCurrent(current + 1);
    };

    const handleBack = () => {
        if (current > 1) setCurrent(current - 1);
    };

    const handleSubmit = async () => {
        try {
            // Check if all questions are answered
            if (Object.values(answers).some(val => val === null)) {
                toast.error("Please answer all questions before submitting.");
                return;
            }

            // Get current subscription
            const subscriptionResponse = await fetch('/api/subscription/current');
            let subscriptionId = null;
            if (subscriptionResponse.ok) {
                const subData = await subscriptionResponse.json();
                subscriptionId = subData.subscription?.id;
            }

            const result = await dispatch(
                submitAssessmentResponse({
                    responses: answers,
                    assessmentType: assesmentType,
                    testName: testName, // e.g., "hexaco"
                    subscriptionId: subscriptionId,
                })
            ).unwrap();

            toast.success("Assessment submitted successfully!");
            router.push("/home")
            // handle result (e.g., show recommendations)
        } catch (error: any) {
            console.error("Assessment submission error:", error);
            toast.error(error?.message || "Failed to submit assessment");
        }
    }



    if (isCheckingSubscription) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking subscription...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div className="text-center text-gray-500">Loading questions...</div>;
    }

    return (
        <>
            <DashboardHeader />
            <div id="quiz-container" className="max-w-4xl mx-auto px-4 py-8">
                <Toaster position="top-center" />
                <div id="quiz-header" className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Assessment Quiz</h1>
                    <p className="text-gray-600">
                        Discover your ideal career path through our comprehensive assessment
                    </p>
                </div>
                <QuizProgress current={current} total={questions.length} />
                <QuestionCard
                    question={questions[current - 1]?.question}
                    description={questions[current - 1]?.description}
                    options={questions[current - 1]?.options}
                    selected={answers[questions[current - 1]?.id] ?? null}
                    onSelect={handleSelect}
                />
                <div id="quiz-navigation" className="flex justify-between items-center">
                    <button
                        id="back-btn"
                        className="flex items-center px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        onClick={handleBack}
                        disabled={current === 1}
                    >
                        <span className="mr-2">
                            <svg width={16} height={16} fill="currentColor" viewBox="0 0 448 512">
                                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                            </svg>
                        </span>
                        Back
                    </button>
                    <QuestionIndicator current={current} total={questions.length} />
                    {current !== questions.length && <button
                        id="next-btn"
                        className="flex items-center px-6 py-3 text-white bg-primary rounded-lg hover:bg-indigo-700 transition-all duration-200"
                        onClick={handleNext}
                    >
                        Next
                        <span className="ml-2">
                            <svg width={16} height={16} fill="currentColor" viewBox="0 0 448 512">
                                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                            </svg>
                        </span>
                    </button>}
                    {/* When all question answered show submit button */}
                    {current === questions.length && (
                        <button
                            // disabled={Object.values(answers).some(val => val === null)}
                            id="submit-btn"
                            className="px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary-700 transition-all duration-200"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div></>
    );
}