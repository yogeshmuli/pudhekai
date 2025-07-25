"use client";
import React from "react";
import LandingHeader from "@app/components/header/landingheader";
import Footer from "@app/components/Footer";

export default function Privacy() {
    return (
        <>
            <LandingHeader />
            <main className="max-w-3xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-4 text-primary">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last updated: 25 July 2025</p>
                <p className="mb-6 text-gray-700">
                    PudheKai (“we”, “our”, or “us”) is committed to protecting the privacy and security of our users (“you”, “your”). This Privacy Policy explains what information we collect, how we use it, how we protect it, and your rights regarding your data.
                </p>
                <h2 className="text-xl font-semibold mt-8 mb-2">1. What Information Do We Collect?</h2>
                <ul className="list-disc ml-6 mb-6 text-gray-700">
                    <li>Assessment responses (personality, interests, abilities)</li>
                    <li>General demographic details (such as age group, educational level, or region—never your exact date of birth, name, or address)</li>
                    <li>Login credentials (if you create an account, only your email/mobile for login)</li>
                </ul>
                <h2 className="text-xl font-semibold mt-8 mb-2">2. How Is Your Data Used?</h2>
                <ul className="list-disc ml-6 mb-6 text-gray-700">
                    <li>To generate anonymous, personalized career recommendations using AI. Your identifiable details are never sent to or used by AI systems.</li>
                    <li>To improve our platform and services, in aggregate and anonymized ways.</li>
                    <li>To communicate with you (e.g., account notifications or important updates).</li>
                </ul>
                <h2 className="text-xl font-semibold mt-8 mb-2">3. Data Security & Storage</h2>
                <ul className="list-disc ml-6 mb-6 text-gray-700">
                    <li>Your data is stored securely on encrypted servers within India.</li>
                    <li>We do not share, sell, or rent your personal information—including name, date of birth, family background, or other sensitive details—with any third party.</li>
                    <li>All AI recommendations are generated anonymously—no personal identifiers are attached to your data at any stage.</li>
                </ul>
                <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Sharing</h2>
                <ul className="list-disc ml-6 mb-6 text-gray-700">
                    <li>We do not share your personal data with any external parties, marketing agencies, educational institutions, or any unauthorized third party.</li>
                    <li>Aggregated, de-identified data (which cannot be linked to any individual) may be used for research or platform improvement.</li>
                </ul>
                <h2 className="text-xl font-semibold mt-8 mb-2">5. Your Rights</h2>
                <ul className="list-disc ml-6 mb-6 text-gray-700">
                    <li>Access the information we hold about you.</li>
                    <li>Request corrections or deletion of your information.</li>
                    <li>Withdraw consent at any time (you can delete your account or request us to do so).</li>
                </ul>
                <p className="mb-6 text-gray-700">
                    To exercise these rights, contact us at: <a href="mailto:hello@pudhekai.com" className="text-primary underline">hello@pudhekai.com</a>
                </p>
                <h2 className="text-xl font-semibold mt-8 mb-2">6. Use by Minors</h2>
                <p className="mb-6 text-gray-700">
                    PudheKai is designed for students aged 14 and above. We do not knowingly collect personal information from children under 14. If you believe a child has provided us with personal information, please contact us for prompt removal.
                </p>
                <h2 className="text-xl font-semibold mt-8 mb-2">7. Cookies & Tracking</h2>
                <p className="mb-6 text-gray-700">
                    We use only essential cookies to keep you logged in and to ensure platform security. We do not use tracking cookies for advertising or third-party analytics.
                </p>
                <h2 className="text-xl font-semibold mt-8 mb-2">8. Changes to This Policy</h2>
                <p className="mb-6 text-gray-700">
                    We may update this Privacy Policy from time to time. Changes will be posted on this page, with the updated date. We encourage you to review this policy regularly.
                </p>
                <hr className="my-8" />
                <p className="mb-4 text-gray-700">
                    <strong>Your privacy is at the heart of PudheKai.</strong><br />
                    We are committed to transparency, security, and giving you control over your data.
                </p>
                <p className="text-gray-700">
                    <strong>Contact Us:</strong><br />
                    For questions or concerns about your privacy, please email: <a href="mailto:hello@pudhekai.com" className="text-primary underline">hello@pudhekai.com</a>
                </p>
            </main>
            <Footer />
        </>
    );
} 