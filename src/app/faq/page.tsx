import LandingHeader from "@app/components/header/landingheader";
import Footer from "@app/components/Footer";
import React from "react";

export default function FAQ() {
    return (
        <>
            <LandingHeader />
            <main className="max-w-3xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-4 text-primary">Frequently Asked Questions (FAQ)</h1>
                <p className="text-gray-500 mb-8">Last updated: 25 July 2025</p>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">1. Why should I take the PudheKai career assessments?</h2>
                    <p className="mb-4 text-gray-700">Our assessments help you understand your unique personality, interests, abilities, and family background. This insight enables us to recommend careers that are the best fit for you—not just based on marks or popular trends, but on who you are as a person. Taking the assessments is the first step toward making an informed and confident career decision.</p>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">2. Why is it important to make an informed career decision early?</h2>
                    <ul className="list-disc ml-6 mb-4 text-gray-700">
                        <li>Avoid confusion and unnecessary changes in higher studies.</li>
                        <li>Save time and resources by focusing on the right subjects and skills.</li>
                        <li>Reduce stress from peer and family pressure.</li>
                        <li>Plan your academic and professional journey in a way that suits your strengths and interests.</li>
                    </ul>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">3. What is the difference between the Free and Paid tiers?</h2>
                    <ul className="list-disc ml-6 mb-2 text-gray-700">
                        <li><strong>Free Tier:</strong></li>
                        <ul className="list-disc ml-6 mb-2">
                            <li>Provides a quick assessment and basic career recommendations.</li>
                            <li>Designed to give you an initial direction.</li>
                            <li>Can be taken once every 6 months.</li>
                        </ul>
                        <li><strong>Paid Tier:</strong></li>
                        <ul className="list-disc ml-6 mb-2">
                            <li>Offers a detailed, in-depth assessment with personalized reports, actionable roadmaps, and guidance on educational pathways.</li>
                            <li>Includes specific recommendations based on multiple frameworks and additional support resources.</li>
                            <li>Paid test can be taken any time after the free test—even immediately—but cannot be retaken within 6 months.</li>
                        </ul>
                    </ul>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">4. Why can’t I take the same test again before 6 months?</h2>
                    <p className="mb-4 text-gray-700">We want your results to truly reflect your current interests, abilities, and personality. Since these attributes don’t usually change quickly, restricting retakes ensures the assessment stays meaningful and prevents “over-testing.” However, if you take a free test and later choose to upgrade, you can take the paid test right away for a deeper analysis.</p>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">5. Can I take the paid assessment immediately after the free test?</h2>
                    <p className="mb-4 text-gray-700">Yes! If you want a more detailed report, you can take the paid assessment right after finishing the free test. The paid assessment is more comprehensive and gives you deeper insights. But even for paid users, we recommend waiting 6 months before retaking any test, unless you have had significant changes in your academic or personal circumstances.</p>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">6. What frameworks or models do you use in your assessments?</h2>
                    <ul className="list-disc ml-6 mb-4 text-gray-700">
                        <li>Personality: HEXACO model</li>
                        <li>Interests: RIASEC (Holland Codes)</li>
                        <li>Abilities/Intelligences: Multiple Intelligences Theory</li>
                        <li>Family Context: Custom Indian-context questionnaire</li>
                    </ul>
                    <p className="mb-4 text-gray-700">These help us make recommendations that are relevant to you and the Indian education system.</p>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">7. Is my personal data safe? Will you share my details with anyone?</h2>
                    <p className="mb-4 text-gray-700">Your privacy is our top priority. We do not share your name, date of birth, family background, or any personal data with any third party. All career recommendations are generated anonymously. For more, see our <a href="/privacy" className="text-primary underline">Privacy Policy</a>.</p>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">8. Can my parents/teachers access my assessment report?</h2>
                    <p className="mb-4 text-gray-700">Only you have access to your personal report. However, you can choose to download or share the report with your parents, teachers, or mentors.</p>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">9. What age group is PudheKai meant for?</h2>
                    <p className="mb-4 text-gray-700">PudheKai is designed for students aged 14 and above, typically from Class 9 onwards. This is the stage where career awareness and planning become important.</p>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">10. How is PudheKai different from other career guidance platforms?</h2>
                    <ul className="list-disc ml-6 mb-4 text-gray-700">
                        <li><strong>India-focused:</strong> Tailored to Indian students, considering local academic pathways and family context.</li>
                        <li><strong>AI-powered:</strong> Uses advanced AI to give personalized and unbiased recommendations.</li>
                        <li><strong>Holistic:</strong> Looks at personality, interests, abilities, and family background.</li>
                        <li><strong>Privacy-first:</strong> No sharing or selling of personal data.</li>
                    </ul>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">11. What happens if I want to delete my account or data?</h2>
                    <p className="mb-4 text-gray-700">You can delete your account at any time from your profile settings, or email us at <a href="mailto:hello@pudhekai.com" className="text-primary underline">hello@pudhekai.com</a> for help. All your data will be securely deleted as per our privacy policy.</p>
                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold mb-2">12. How can I get help or ask more questions?</h2>
                    <p className="mb-4 text-gray-700">We’re always here to help! Email us at <a href="mailto:hello@pudhekai.com" className="text-primary underline">hello@pudhekai.com</a> or use the contact form on our website.</p>
                    <hr className="my-6" />

                    <div className="text-center mt-8">
                        <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                        <p className="mb-4">Reach out to us, and we’ll be happy to help you make the right career choice</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
} 