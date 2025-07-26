"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@app/hooks";
import { setTestName } from "@app/slice/assesement.slice";
import DashboardHeader from "@app/components/header/dashboardheader";

export default function PreAssessmentPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleStartAssessment = () => {
        // Set family background as the first test
        dispatch(setTestName("family"));
        router.push("/assessment");
    };

    return (
        <>
            <DashboardHeader />
            <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <section id="hero-section" className="text-center mb-12">
                    <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <span className="mr-2">
                            <svg className="text-primary" width={18} height={18} fill="currentColor" viewBox="0 0 576 512">
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                            </svg>
                        </span>
                        Career Assessment Instructions
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        Before You Start:<br />
                        <span className="text-transparent bg-clip-text bg-primary ">
                            Instructions for Students
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Take a deep breath and relax! This assessment is designed to help you discover your unique strengths and potential career paths. There's no pressure—just be yourself.
                    </p>
                </section>

                {/* Instructions Section */}
                <section id="instructions-section" className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Expect</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <span className="text-primary font-bold">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Family Background</h3>
                                        <p className="text-gray-600 text-sm">Share information about your family context and support system.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <span className="text-primary font-bold">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Personality Assessment</h3>
                                        <p className="text-gray-600 text-sm">Discover your unique personality traits and work preferences.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <span className="text-primary font-bold">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Interest Assessment</h3>
                                        <p className="text-gray-600 text-sm">Explore your career interests and preferences.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <span className="text-primary font-bold">4</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Intelligence Assessment</h3>
                                        <p className="text-gray-600 text-sm">Discover your learning style and intelligence types.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <span className="text-primary font-bold">5</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
                                        <p className="text-gray-600 text-sm">Get personalized career recommendations based on your results.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <span className="text-primary font-bold">6</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Detailed Report</h3>
                                        <p className="text-gray-600 text-sm">Download your comprehensive career guidance report.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tips Section */}
                <section id="tips-section" className="mb-12">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips for Best Results</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 rounded-full p-1 mt-1">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Answer honestly - there are no right or wrong answers</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 rounded-full p-1 mt-1">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Take your time to think about each question</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 rounded-full p-1 mt-1">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Choose the option that best describes you</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 rounded-full p-1 mt-1">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Don't overthink - go with your first instinct</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 rounded-full p-1 mt-1">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Find a quiet place to complete the assessment</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 rounded-full p-1 mt-1">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">You can save and continue later if needed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Start Section */}
                <section id="start-section" className="text-center">
                    <button 
                        onClick={handleStartAssessment}
                        className="bg-primary text-white px-12 py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center"
                    >
                        <i className="mr-3" data-fa-i2svg=""><svg className="svg-inline--fa fa-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg></i>
                        I'm Ready to Start the Assessment
                    </button>
                    <p className="text-gray-500 mt-4">Estimated time: 15-20 minutes</p>
                </section>

            </main>
        </>
    )
}

