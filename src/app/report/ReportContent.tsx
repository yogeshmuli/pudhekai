'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';
import DashboardHeader from '../../components/header/dashboardheader';

// Interfaces
interface StudentDetails {
  name: string;
  age: number;
  gender: string;
  assessmentDate: string;
  reportId: string;
  contact: string;
  location: string;
}
interface FamilyBackground {
  socioEconomicStatus: string;
  livingArea: string;
  parentalEducation: string;
  familyOccupation: string;
  supportForEducation: string;
  professionalRoleModels: string;
  languagesSpoken: string;
  mobility: string;
}
interface AptitudeScore {
  category: string;
  correct: number;
  total: number;
  percent: number;
  label: string;
}

interface AptitudeInterpretation {
  overallSummary: string;
  aptitudeProfile: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  careerImplications: string[];
  suggestedCareers: string[];
  learningStrategies: string[];
}

interface RiasecScore {
  area: string;
  score: number;
}

interface RiasecInterpretation {
  overallSummary: string;
  interestProfile: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  careerImplications: string[];
  suggestedCareers: string[];
  workStyle: string;
  learningApproach: string;
}

interface HexacoScore {
  trait: string;
  score: number;
}

interface HexacoInterpretation {
  overallSummary: string;
  personalityProfile: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  careerImplications: string[];
  leadershipStyle: string;
  workStyle: string;
  communicationStyle: string;
  teamDynamics: string;
  stressManagement: string;
  learningApproach: string;
}

interface MIScore {
  intelligence: string;
  score: number;
}

interface MIInterpretation {
  overallSummary: string;
  intelligenceProfile: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  careerImplications: string[];
  suggestedCareers: string[];
  learningStrategies: string[];
}

interface CareerRecommendation {
  title: string;
  tag: string;
  why: string;
  jobRole: string;
  salary: string;
  careerPath: string;
  growthTip: string;
}

interface ReportData {
  studentDetails: StudentDetails;
  familyBackground: FamilyBackground;
  aptitudeScores: AptitudeScore[];
  aptitudeInterpretation?: AptitudeInterpretation; // Single aptitude interpretation
  riasecScores: RiasecScore[];
  riasecInterpretation?: RiasecInterpretation; // Single RIASEC interpretation
  hexacoScores: HexacoScore[];
  hexacoInterpretation?: HexacoInterpretation; // Single HEXACO interpretation
  miScores: MIScore[];
  miInterpretation?: MIInterpretation; // Single MI interpretation
  recommendations: CareerRecommendation[];
}

const ReportContent = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Wait for auth initialization to complete
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    const subscriptionId = searchParams.get('subscription');
    if (!subscriptionId) {
      setError('No subscription ID provided');
      setIsLoading(false);
      return;
    }
    fetchReportData(subscriptionId);
  }, [isAuthenticated, authLoading, router, searchParams]);

  const fetchReportData = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/report?subscription=${subscriptionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const subscriptionId = searchParams.get('subscription');
      if (!subscriptionId) {
        throw new Error('No subscription ID available');
      }
      
      const response = await fetch('/api/report/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pudhekai-report-${subscriptionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{authLoading ? 'Checking authentication...' : 'Loading report...'}</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No report data available</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Recommendation Report</h1>
            <p className="text-gray-600">Your personalized career guidance analysis</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            📄 Download PDF
          </button>
        </div>
        {/* Report Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Report Header */}
          <header className="text-center mb-8">
            <div className="text-4xl font-bold text-primary mb-2">PudheKai</div>
            <div className="text-gray-600 text-lg">
              AI-Powered Career Recommendation Report
              <br />
              <span className="text-sm">"What Next? पुढे काय?"</span>
            </div>
          </header>
          {/* 1. Student Details */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              1. Student Details
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-900">{reportData.studentDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Age:</span>
                  <span className="text-gray-900">{reportData.studentDetails.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Gender:</span>
                  <span className="text-gray-900">{reportData.studentDetails.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Assessment Date:</span>
                  <span className="text-gray-900">{reportData.studentDetails.assessmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Report ID:</span>
                  <span className="text-gray-900">{reportData.studentDetails.reportId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Contact:</span>
                  <span className="text-gray-900">{reportData.studentDetails.contact}</span>
                </div>
                <div className="flex justify-between md:col-span-2">
                  <span className="font-semibold text-gray-700">Location:</span>
                  <span className="text-gray-900">{reportData.studentDetails.location}</span>
                </div>
              </div>
            </div>
          </section>
          {/* 2. Family Background */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              2. Family Background (Context Assessment)
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-700">Socio-economic Status:</span>
                  <span className="font-semibold text-primary">{reportData.familyBackground.socioEconomicStatus}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Living Area:</span>
                  <span className="font-semibold text-primary">{reportData.familyBackground.livingArea}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Parental Education:</span>
                  <span className="font-semibold text-primary">{reportData.familyBackground.parentalEducation}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Family Occupation:</span>
                  <span className="font-semibold text-primary">{reportData.familyBackground.familyOccupation}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Support for Education:</span>
                  <span className="font-semibold text-primary">{reportData.familyBackground.supportForEducation}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Professional Role Models:</span>
                  <span className="font-semibold text-primary">{reportData.familyBackground.professionalRoleModels}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Languages Spoken:</span>
                  <span className="font-semibold text-primary">{reportData.familyBackground.languagesSpoken}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700">Mobility:</span>
                  <span className="font-semibold text-primary">{reportData.familyBackground.mobility}</span>
                </li>
              </ul>
            </div>
          </section>
          {/* 3. Aptitude Assessment */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              3. Aptitude Assessment
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Category</th>
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Correct</th>
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Total</th>
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Percent</th>
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Label</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.aptitudeScores.map((score, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-3">{score.category}</td>
                      <td className="p-3">{score.correct}</td>
                      <td className="p-3">{score.total}</td>
                      <td className="p-3">{score.percent}%</td>
                      <td className="p-3">{score.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* AI-Generated Aptitude Interpretations */}
            {reportData.aptitudeInterpretation && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">AI-Generated Aptitude Insights</h3>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Overall Summary</h4>
                  <p className="text-gray-700 mb-3">{reportData.aptitudeInterpretation.overallSummary}</p>
                  
                  <h4 className="font-semibold text-blue-800 mb-2">Aptitude Profile</h4>
                  <p className="text-gray-700 mb-3">{reportData.aptitudeInterpretation.aptitudeProfile}</p>
                  
                  {reportData.aptitudeInterpretation.keyStrengths && reportData.aptitudeInterpretation.keyStrengths.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-green-700">Key Strengths:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.aptitudeInterpretation.keyStrengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.aptitudeInterpretation.areasForGrowth && reportData.aptitudeInterpretation.areasForGrowth.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-orange-700">Areas for Growth:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.aptitudeInterpretation.areasForGrowth.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.aptitudeInterpretation.careerImplications && reportData.aptitudeInterpretation.careerImplications.length > 0 && (
                    <div>
                      <span className="font-semibold text-purple-700">Career Implications:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.aptitudeInterpretation.careerImplications.map((career, idx) => (
                          <li key={idx}>{career}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.aptitudeInterpretation.learningStrategies && reportData.aptitudeInterpretation.learningStrategies.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-purple-700">Learning Strategies:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.aptitudeInterpretation.learningStrategies.map((strategy, idx) => (
                          <li key={idx}>{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.aptitudeInterpretation.suggestedCareers && reportData.aptitudeInterpretation.suggestedCareers.length > 0 && (
                    <div>
                      <span className="font-semibold text-teal-700">Suggested Careers:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.aptitudeInterpretation.suggestedCareers.map((career, idx) => (
                          <li key={idx}>{career}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Fallback interpretation if no AI interpretations available */}
            {(!reportData.aptitudeInterpretation) && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-800">
                  <span className="font-semibold">Interpretation:</span> Strong logical reasoning and problem-solving skills, moderate spatial visualization.
                </p>
              </div>
            )}
          </section>
          {/* 4. RIASEC */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              4. RIASEC (Interest Profile)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Area</th>
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Score (out of 6)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.riasecScores.map((score, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-3">{score.area}</td>
                      <td className="p-3">{score.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* AI-Generated RIASEC Interpretations */}
            {reportData.riasecInterpretation && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">AI-Generated RIASEC Insights</h3>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">Overall Summary</h4>
                  <p className="text-gray-700 mb-3">{reportData.riasecInterpretation.overallSummary}</p>
                  
                  <h4 className="font-semibold text-purple-800 mb-2">Interest Profile</h4>
                  <p className="text-gray-700 mb-3">{reportData.riasecInterpretation.interestProfile}</p>
                  
                  {reportData.riasecInterpretation.keyStrengths && reportData.riasecInterpretation.keyStrengths.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-green-700">Key Strengths:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.riasecInterpretation.keyStrengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.riasecInterpretation.areasForGrowth && reportData.riasecInterpretation.areasForGrowth.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-orange-700">Areas for Growth:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.riasecInterpretation.areasForGrowth.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.riasecInterpretation.careerImplications && reportData.riasecInterpretation.careerImplications.length > 0 && (
                    <div>
                      <span className="font-semibold text-purple-700">Career Implications:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.riasecInterpretation.careerImplications.map((career, idx) => (
                          <li key={idx}>{career}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.riasecInterpretation.suggestedCareers && reportData.riasecInterpretation.suggestedCareers.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-blue-700">Suggested Careers:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.riasecInterpretation.suggestedCareers.map((career, idx) => (
                          <li key={idx}>{career}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.riasecInterpretation.workStyle && (
                    <div className="mb-3">
                      <span className="font-semibold text-green-700">Work Style:</span>
                      <p className="text-gray-700">{reportData.riasecInterpretation.workStyle}</p>
                    </div>
                  )}
                  
                  {reportData.riasecInterpretation.learningApproach && (
                    <div>
                      <span className="font-semibold text-purple-700">Learning Approach:</span>
                      <p className="text-gray-700">{reportData.riasecInterpretation.learningApproach}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Fallback interpretation if no AI interpretations available */}
            {(!reportData.riasecInterpretation) && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <p className="text-gray-800">
                  <span className="font-semibold">Interpretation:</span> Strong interest in Artistic and Conventional activities, moderate Enterprising orientation.
                </p>
              </div>
            )}
          </section>
          {/* 5. HEXACO (Personality Profile) */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              5. HEXACO (Personality Profile)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Trait</th>
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Score (out of 5)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.hexacoScores.map((score, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-3">{score.trait}</td>
                      <td className="p-3">{score.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* AI-Generated HEXACO Interpretations */}
            {reportData.hexacoInterpretation && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">AI-Generated Personality Insights</h3>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Overall Summary</h4>
                  <p className="text-gray-700 mb-3">{reportData.hexacoInterpretation.overallSummary}</p>
                  
                  <h4 className="font-semibold text-blue-800 mb-2">Personality Profile</h4>
                  <p className="text-gray-700 mb-3">{reportData.hexacoInterpretation.personalityProfile}</p>
                  
                  {reportData.hexacoInterpretation.keyStrengths && reportData.hexacoInterpretation.keyStrengths.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-green-700">Key Strengths:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.hexacoInterpretation.keyStrengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.hexacoInterpretation.areasForGrowth && reportData.hexacoInterpretation.areasForGrowth.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-orange-700">Areas for Growth:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.hexacoInterpretation.areasForGrowth.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.hexacoInterpretation.careerImplications && reportData.hexacoInterpretation.careerImplications.length > 0 && (
                    <div>
                      <span className="font-semibold text-purple-700">Career Implications:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.hexacoInterpretation.careerImplications.map((career, idx) => (
                          <li key={idx}>{career}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.hexacoInterpretation.leadershipStyle && (
                    <div className="mb-3">
                      <span className="font-semibold text-blue-700">Leadership Style:</span>
                      <p className="text-gray-700">{reportData.hexacoInterpretation.leadershipStyle}</p>
                    </div>
                  )}
                  
                  {reportData.hexacoInterpretation.workStyle && (
                    <div className="mb-3">
                      <span className="font-semibold text-green-700">Work Style:</span>
                      <p className="text-gray-700">{reportData.hexacoInterpretation.workStyle}</p>
                    </div>
                  )}
                  
                  {reportData.hexacoInterpretation.communicationStyle && (
                    <div className="mb-3">
                      <span className="font-semibold text-yellow-700">Communication Style:</span>
                      <p className="text-gray-700">{reportData.hexacoInterpretation.communicationStyle}</p>
                    </div>
                  )}
                  
                  {reportData.hexacoInterpretation.teamDynamics && (
                    <div className="mb-3">
                      <span className="font-semibold text-indigo-700">Team Dynamics:</span>
                      <p className="text-gray-700">{reportData.hexacoInterpretation.teamDynamics}</p>
                    </div>
                  )}
                  
                  {reportData.hexacoInterpretation.stressManagement && (
                    <div className="mb-3">
                      <span className="font-semibold text-red-700">Stress Management:</span>
                      <p className="text-gray-700">{reportData.hexacoInterpretation.stressManagement}</p>
                    </div>
                  )}
                  
                  {reportData.hexacoInterpretation.learningApproach && (
                    <div>
                      <span className="font-semibold text-pink-700">Learning Approach:</span>
                      <p className="text-gray-700">{reportData.hexacoInterpretation.learningApproach}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Fallback interpretation if no AI interpretations available */}
            {(!reportData.hexacoInterpretation) && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-gray-800">
                  <span className="font-semibold">Interpretation:</span> High agreeableness, moderate emotionality, relatively lower conscientiousness.
                </p>
              </div>
            )}
          </section>
          {/* 6. Multiple Intelligences */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              6. Multiple Intelligences (MI)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Intelligence</th>
                    <th className="border-b border-gray-300 p-3 text-left font-semibold text-primary">Score (out of 5)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.miScores.map((score, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-3">{score.intelligence}</td>
                      <td className="p-3">{score.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* AI-Generated MI Interpretations */}
            {reportData.miInterpretation && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">AI-Generated MI Insights</h3>
                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2">Overall Summary</h4>
                  <p className="text-gray-700 mb-3">{reportData.miInterpretation.overallSummary}</p>
                  
                  <h4 className="font-semibold text-orange-800 mb-2">Intelligence Profile</h4>
                  <p className="text-gray-700 mb-3">{reportData.miInterpretation.intelligenceProfile}</p>
                  
                  {reportData.miInterpretation.keyStrengths && reportData.miInterpretation.keyStrengths.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-green-700">Key Strengths:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.miInterpretation.keyStrengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.miInterpretation.areasForGrowth && reportData.miInterpretation.areasForGrowth.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-orange-700">Areas for Growth:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.miInterpretation.areasForGrowth.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.miInterpretation.careerImplications && reportData.miInterpretation.careerImplications.length > 0 && (
                    <div>
                      <span className="font-semibold text-purple-700">Career Implications:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.miInterpretation.careerImplications.map((career, idx) => (
                          <li key={idx}>{career}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.miInterpretation.suggestedCareers && reportData.miInterpretation.suggestedCareers.length > 0 && (
                    <div className="mb-3">
                      <span className="font-semibold text-blue-700">Suggested Careers:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.miInterpretation.suggestedCareers.map((career, idx) => (
                          <li key={idx}>{career}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.miInterpretation.learningStrategies && reportData.miInterpretation.learningStrategies.length > 0 && (
                    <div>
                      <span className="font-semibold text-purple-700">Learning Strategies:</span>
                      <ul className="list-disc list-inside ml-2 text-gray-700">
                        {reportData.miInterpretation.learningStrategies.map((strategy, idx) => (
                          <li key={idx}>{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Fallback interpretation if no AI interpretations available */}
            {(!reportData.miInterpretation) && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <p className="text-gray-800">
                  <span className="font-semibold">Interpretation:</span> High Logical-Mathematical and Interpersonal Intelligence, moderate Spatial Intelligence.
                </p>
              </div>
            )}
          </section>
          {/* 7. AI-Powered Career Recommendations */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              7. AI-Powered Career Recommendations
            </h2>
            <div className="space-y-6">
              {reportData.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-primary/5 border-l-4 border-primary rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {index + 1}. {recommendation.title}
                    <span className="inline-block bg-primary/20 text-primary text-sm px-3 py-1 rounded-full ml-3">
                      {recommendation.tag}
                    </span>
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><span className="font-semibold">Why:</span> {recommendation.why}</li>
                    <li><span className="font-semibold">Job Role:</span> {recommendation.jobRole}</li>
                    <li><span className="font-semibold">Salary:</span> {recommendation.salary}</li>
                    <li><span className="font-semibold">Career Path:</span> {recommendation.careerPath}</li>
                    <li><span className="font-semibold">Growth Tip:</span> {recommendation.growthTip}</li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
          {/* 8. Guidance & Next Steps */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              8. Guidance & Next Steps
            </h2>
            <div className="bg-yellow-50 rounded-lg p-6">
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-semibold">Self-Directed Learning:</span> Explore and build on personal strengths (spatial, artistic, writing).</li>
                <li><span className="font-semibold">Skill Development:</span> For design/visualization, try Figma, Adobe XD, Blender, 3ds Max. For writing, join open source projects or start a blog.</li>
                <li><span className="font-semibold">Explore:</span> Internships, online courses (Coursera, Udemy), mentorship programs.</li>
                <li><span className="font-semibold">Plan for Growth:</span> Track your progress, seek feedback, update your goals every 6 months.</li>
              </ul>
            </div>
          </section>
          {/* 9. Resources & Links */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              9. Resources & Links
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <ul className="space-y-2">
                <li><a href="#" className="text-primary hover:underline">Career Pathways & Salary Data</a></li>
                <li><a href="#" className="text-primary hover:underline">Free Skill Courses</a></li>
                <li><a href="#" className="text-primary hover:underline">Mentoring & Community</a></li>
              </ul>
            </div>
          </section>
          {/* 10. Disclaimer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">
              10. Disclaimer
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 text-sm">
                These recommendations are based on assessments and AI analysis using PudheKai's framework. Students should consider personal interests, discuss with family, and consult a career counselor for final decisions.
              </p>
            </div>
          </section>
          {/* Footer */}
          <footer className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="font-semibold text-gray-800">PudheKai – What Next?</p>
            <p className="text-gray-600">Find Your Path, Own Your Future.</p>
            <p className="text-sm text-gray-500 mt-2">www.pudhekai.com</p>
          </footer>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/assessment')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Take New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportContent; 