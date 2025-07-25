import React from "react";
import LandingHeader from "@app/components/header/landingheader";
import Footer from "@app/components/Footer";

export default function AboutPage() {
  return (
    <>
      <LandingHeader />
      <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-4xl font-bold mb-4 text-primary">About Us</h1>
        <h2 className="text-2xl font-semibold mb-2">Pudhe Kai? (पुढे काय ?)</h2>
        <p className="mb-6">
          “Pudhe Kai?” (What next?) is the question every teenager in India hears at family gatherings, from relatives, friends, and well-wishers. It’s a question about the future—about career choices and life direction. Too often, the answers are shaped by family expectations, societal pressures, or simply peer influence. The result? Many young minds end up making crucial academic and career decisions without real clarity or self-understanding.
        </p>
        <p className="mb-6">
          At Pudhe Kai, we believe every student deserves a clear, personalized roadmap for their future—one that is rooted in their unique personality, interests, intelligence, and family context.
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-2">Our Mission</h3>
        <p className="mb-6">
          Pudhe Kai is an AI-powered career guidance platform designed to empower teenagers and young adults to make informed, confident career choices. We help students discover their strengths, aspirations, and opportunities, making the journey from “What next?” to “I know what’s next!” seamless and stress-free.
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-2">Our Approach</h3>
        <p><img src="/self-discovery.png" alt="Approach" className="w-full h-auto" /></p>
        <p className="mb-4">Unlike traditional one-size-fits-all counseling, Pudhe Kai uses a holistic, scientific approach. We assess each student across four critical pillars:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><span className="font-semibold">Personality:</span> Who are you at your core?<br /><span className="text-gray-600">Framework used: HEXACO Personality Inventory</span></li>
          <li><span className="font-semibold">Interests:</span> What excites you and holds your attention?<br /><span className="text-gray-600">Framework used: RIASEC Interest Model (Holland’s Codes)</span></li>
          <li><span className="font-semibold">Intelligence/Abilities:</span> What are your cognitive strengths?<br /><span className="text-gray-600">Framework used: Multiple Intelligences Assessment</span></li>
          <li><span className="font-semibold">Family Context:</span> What’s your background—education, financial, location, parental occupation?<br /><span className="text-gray-600">Custom assessment model tailored for Indian families</span></li>
        </ul>
        <p className="mb-6">
          Our platform combines these insights using advanced Artificial Intelligence to recommend career paths, educational courses, and future opportunities that truly fit you.
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-2">Why Pudhe Kai?</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><span className="font-semibold">Personalized Guidance:</span> Every recommendation is tailored to your unique profile.</li>
          <li><span className="font-semibold">Data-Driven Decisions:</span> Our assessments are based on globally recognized frameworks, ensuring reliability and accuracy.</li>
          <li><span className="font-semibold">Clarity Early On:</span> We help students as young as 14–15 get a head start on the right academic and career track—saving time, effort, and stress.</li>
          <li><span className="font-semibold">Empowering Families:</span> By factoring in family context, we ensure recommendations are practical and achievable, not just aspirational.</li>
          <li><span className="font-semibold">Accessible, Confidential, and Supportive:</span> Your results are private, and our mentors are available to support you every step of the way.</li>
        </ul>
        <h3 className="text-xl font-semibold mt-8 mb-2">Assessment Frameworks We Use</h3>
        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li><span className="font-semibold">HEXACO Personality Inventory:</span> For understanding core personality traits</li>
          <li><span className="font-semibold">RIASEC Model (Holland’s Codes):</span> For mapping career interests</li>
          <li><span className="font-semibold">Multiple Intelligences Theory (Howard Gardner):</span> For identifying cognitive strengths</li>
          <li><span className="font-semibold">Custom Family Context Assessment:</span> Developed for Indian social and educational realities</li>
        </ul>
        <div className="border-t border-gray-200 my-8" />
        <div className="text-center">
          <h4 className="text-2xl font-bold mb-2">Ready to discover your unique pathway?</h4>
          <p className="mb-4">Join Pudhe Kai today and take the guesswork out of your future.</p>
        </div>
      </main>
      <Footer />
    </>
  );
} 