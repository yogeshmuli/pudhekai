"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PreAssessmentPage() {
    const router = useRouter();

    return (
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

            {/* Calming Message */}
            <section id="calming-message" className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-10 border border-green-100">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="text-green-600 text-2xl" width={28} height={28} fill="currentColor" viewBox="0 0 512 512">
                            <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-2xl font-semibold text-green-800 text-center mb-4">You've Got This!</h3>
                <p className="text-green-700 text-center text-lg leading-relaxed">
                    Remember, this is about discovering who you are and what excites you. There are no wrong answers—only insights waiting to be uncovered about your amazing potential.
                </p>
            </section>

            {/* Instructions Grid */}
            <section id="instructions-grid" className="grid md:grid-cols-2 gap-6 mb-12">
                {/* Instruction 1 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                            <svg className="text-blue-600 text-xl" width={22} height={22} fill="currentColor" viewBox="0 0 512 512">
                                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Be Honest</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Answer each question truthfully. The test is designed to help you discover your true strengths, interests, and potential career paths.
                    </p>
                </div>
                {/* Instruction 2 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                            <svg className="text-purple-600 text-xl" width={22} height={22} fill="currentColor" viewBox="0 0 512 512">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">No Right or Wrong Answers</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        There are no correct or incorrect answers. Each person is unique—your answers simply reflect your personality, interests, and background.
                    </p>
                </div>
                {/* Instruction 3 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                            <svg className="text-yellow-600 text-xl" width={22} height={22} fill="currentColor" viewBox="0 0 448 512">
                                <path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Trust Your First Instinct</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Go with your first response. Don't overthink or try to guess what the "best" answer might be.
                    </p>
                </div>
                {/* Instruction 4 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                            <svg className="text-indigo-600 text-xl" width={22} height={22} fill="currentColor" viewBox="0 0 512 512">
                                <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Complete in One Go</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Try to finish the test without taking long breaks. This helps ensure your answers reflect your current feelings and thoughts.
                    </p>
                </div>
                {/* Instruction 5 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                            <svg className="text-green-600 text-xl" width={22} height={22} fill="currentColor" viewBox="0 0 512 512">
                                <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">All Information is Confidential</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Your responses will be kept private and used only to help you with career guidance.
                    </p>
                </div>
                {/* Instruction 6 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mr-4">
                            <svg className="text-pink-600 text-xl" width={22} height={22} fill="currentColor" viewBox="0 0 512 512">
                                <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Relax and Take Your Time</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        There's no time limit. Read each question carefully and answer at your own pace.
                    </p>
                </div>
                {/* Instruction 7 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                            <svg className="text-orange-600 text-xl" width={22} height={22} fill="currentColor" viewBox="0 0 512 512">
                                <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Be Yourself</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-center">
                        This test is about you—your preferences, your experiences, and your ambitions. Be genuine!
                    </p>
                </div>
            </section>
            {/* Quiz Preview */}
            <section id="quiz-categories" className="bg-white rounded-2xl p-8 mb-10 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-900 text-center mb-6">What You'll Explore</h3>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <i className="text-blue-600 text-2xl mb-2" data-fa-i2svg=""><svg className="svg-inline--fa fa-brain " aria-hidden="true" focusable="false" data-prefix="fas" data-icon="brain" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"></path></svg></i>
                        <p className="font-medium text-gray-800">Personality</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <i className="text-purple-600 text-2xl mb-2" data-fa-i2svg=""><svg className="svg-inline--fa fa-star" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg></i>
                        <p className="font-medium text-gray-800">Interests</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                        <i className="text-green-600 text-2xl mb-2" data-fa-i2svg=""><svg className="svg-inline--fa fa-gear" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gear" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"></path></svg></i>
                        <p className="font-medium text-gray-800">Skills</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                        <i className="text-orange-600 text-2xl mb-2" data-fa-i2svg=""><svg className="svg-inline--fa fa-graduation-cap" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="graduation-cap" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"></path></svg></i>
                        <p className="font-medium text-gray-800">Background</p>
                    </div>
                </div>
            </section>
            {/* Start button */}
            <section id="start-section" className="text-center">
                <Link href={"/assessment"} className="bg-primary text-white px-12 py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center">
                    <i className="mr-3" data-fa-i2svg=""><svg className="svg-inline--fa fa-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg></i>
                    I'm Ready to Start the Quiz
                </Link>
                <p className="text-gray-500 mt-4">Estimated time: 15-20 minutes</p>
            </section>

        </main>)


}

