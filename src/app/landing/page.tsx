"use client";
import React from "react";
import Header from "@app/components/header/landingheader";
import TestimonialSection from "@app/app/landing/testimonial/index";
import HowItWorksSection from "./howitworks";
import TrustedBySection from "./trustedby";
import Footer from "@app/components/Footer";


export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen">
            <Header />

            <section id="hero" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                What Next?
                                <span className="text-primary">Find Your Career Path</span>
                                with AI
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Discover your best-fit careers based on your personality, interests, and intelligence.
                            </p>
                            <button className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
                                Start Now
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <img
                                className="w-full max-w-lg rounded-2xl shadow-2xl"
                                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/8537b1f12a-982e85588a27f553017b.png"
                                alt="young student with roadmap and upward arrows, career guidance illustration, modern flat design, bright colors"
                            />
                        </div>
                    </div>
                </div>
            </section>
            {/* section 2 */}
            <HowItWorksSection />
            <TestimonialSection />
            <TrustedBySection />
            <Footer />
        </div>
    );
}