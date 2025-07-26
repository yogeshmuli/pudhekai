export type AssessmentSummary = {
    traitSummary: string;
    keyTraits: string[];
    interestSummary: string;
    riasecScores: { [type: string]: number };
    intelligenceSummary: string;
    aptitudeScores: {
      patternRecognition: number;
      logicalReasoning: number;
      numericalReasoning: number;
      criticalReasoning: number;
      patternRecognitionPct: number;
      logicalReasoningPct: number;
      numericalReasoningPct: number;
      criticalReasoningPct: number;
      totalScore: number;
      totalPct: number;
    };
    familyContext: string;
    strengths: string[];
    improvements: string[];
    hexacoInterpretation?: any; // Single HEXACO interpretation
    riasecInterpretation?: any; // Single RIASEC interpretation
    miInterpretation?: any; // Single MI interpretation
    aptitudeInterpretation?: any; // Single aptitude interpretation
  };
  
  export type CareerRecommendation = {
    jobTitle: string;
    industry: string;
    jobDuties: string;
    keySkills: string;
    salary: string;
    education: string;
    careerPath: string;
    cities: string;
    workEnvironment: string;
    whyFit: string;
    alternatives: string;
  };
  
  export type CareerReport = {
    studentName: string;
    tier: "Free" | "Paid";
    date: string;
    introduction: string;
    interpretationGuide: string;
    summary: AssessmentSummary;
    recommendations: CareerRecommendation[];
    nextSteps: string[];
    disclaimer: string;
  };
  
  // Pure function: generate a holistic report from provided data
  export function generateCareerReport({
    user,
    assessments,
    recommendations,
    subscription,
  }: {
    user: any;
    assessments: Record<string, any>;
    recommendations: CareerRecommendation[];
    subscription?: any;
  }): CareerReport {
    const studentName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "User";
    const tier = subscription?.tier || user.tier || "Free";
    const hexaco = assessments.hexaco;
    const riasec = assessments.riasec;
    const mi = assessments.mi;
    const family = assessments.family;
    const aptitude = assessments.aptitude;
    const date = new Date().toISOString().split('T')[0];
    
    // Extract strengths and improvements from all interpretations
    const strengths: string[] = [];
    const improvements: string[] = [];
    const keyTraits: string[] = [];
    
    // HEXACO interpretation (single object)
    if (hexaco?.interpretation) {
      if (hexaco.interpretation.keyStrengths) {
        strengths.push(...hexaco.interpretation.keyStrengths);
      }
      if (hexaco.interpretation.areasForGrowth) {
        improvements.push(...hexaco.interpretation.areasForGrowth);
      }
      if (hexaco.interpretation.careerImplications) {
        strengths.push(...hexaco.interpretation.careerImplications);
      }
    }
    
    // RIASEC interpretation (single object)
    if (riasec?.interpretation) {
      if (riasec.interpretation.keyStrengths) {
        strengths.push(...riasec.interpretation.keyStrengths);
      }
      if (riasec.interpretation.areasForGrowth) {
        improvements.push(...riasec.interpretation.areasForGrowth);
      }
      if (riasec.interpretation.careerImplications) {
        strengths.push(...riasec.interpretation.careerImplications);
      }
    }
    
    // MI interpretation (single object)
    if (mi?.interpretation) {
      if (mi.interpretation.keyStrengths) {
        strengths.push(...mi.interpretation.keyStrengths);
      }
      if (mi.interpretation.areasForGrowth) {
        improvements.push(...mi.interpretation.areasForGrowth);
      }
      if (mi.interpretation.careerImplications) {
        strengths.push(...mi.interpretation.careerImplications);
      }
    }
    
    // Aptitude interpretation (single object)
    if (aptitude?.interpretation) {
      if (aptitude.interpretation.keyStrengths) {
        strengths.push(...aptitude.interpretation.keyStrengths);
      }
      if (aptitude.interpretation.areasForGrowth) {
        improvements.push(...aptitude.interpretation.areasForGrowth);
      }
      if (aptitude.interpretation.careerImplications) {
        strengths.push(...aptitude.interpretation.careerImplications);
      }
    }
    
    const summary: AssessmentSummary = {
      traitSummary: hexaco?.traitScores ? JSON.stringify(hexaco.traitScores) : "",
      keyTraits: keyTraits.length > 0 ? keyTraits : [],
      interestSummary: riasec?.categoryScores ? JSON.stringify(riasec.categoryScores) : "",
      riasecScores: riasec?.categoryScores || {},
      intelligenceSummary: mi?.miScores ? JSON.stringify(mi.miScores) : "",
      aptitudeScores: aptitude?.categories || {},
      familyContext: family?.summary || "",
      strengths: strengths.length > 0 ? strengths : [],
      improvements: improvements.length > 0 ? improvements : [],
      hexacoInterpretation: hexaco?.interpretation || null,
      riasecInterpretation: riasec?.interpretation || null,
      miInterpretation: mi?.interpretation || null,
      aptitudeInterpretation: aptitude?.interpretation || null,
    };
    const introduction =
      "Welcome to your personalized career assessment report! This report summarizes your unique strengths, interests, and potential career paths based on your responses.";
    const interpretationGuide =
      "This report interprets your assessment results across four areas: personality, interests, cognitive abilities, and family context. Use this to reflect on your journey and inform your future choices.";
    const nextSteps =
      tier === "Paid"
        ? [
            "Explore the recommended career paths and research each one in more detail.",
            "Reach out to professionals or alumni in your fields of interest.",
            "Plan to develop skills in your areas for improvement.",
            "Set up a session with a qualified career counsellor for more personalized guidance.",
          ]
        : [
            "Read about the suggested careers and think about what interests you.",
            "Discuss these options with your teachers, parents, or a counsellor.",
          ];
    const disclaimer =
      "These recommendations are generated by AI and based on your responses. Many factors influence success and satisfaction in any career, including personal motivation, real-world experience, and changing opportunities. Please consider discussing your report with a qualified career counsellor or mentor before making important decisions.";
    return {
      studentName,
      tier,
      date,
      introduction,
      interpretationGuide,
      summary,
      recommendations,
      nextSteps,
      disclaimer,
    };
  }