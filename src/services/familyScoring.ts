// Family context question schema (for reference)
export type FamilyContextResponse = {
    [id: string]: string; // key = question id (fc1, fc2, etc.), value = selected option
  };
  
  // Optionally, define mappings for human-readable summary
  const profileLabels = {
    fc1: {
      "Very Low Income": "from a very low income family",
      "Low Income": "from a low income background",
      "Middle Income": "from a middle income family",
      "Upper Middle Income": "from an upper middle income background",
      "Wealthy": "from a wealthy family"
    },
    fc2: {
      "Rural area / Village": "grew up in a rural area/village",
      "Small Town": "grew up in a small town",
      "City / Urban area": "grew up in a city or urban area",
      "Metro city": "grew up in a metro city"
    },
    fc3: {
      "No formal schooling": "whose parents have no formal schooling",
      "Up to 10th grade (SSC/Matric)": "whose parents studied up to 10th grade",
      "12th grade (HSC/PUC)": "whose parents studied up to 12th grade",
      "Undergraduate degree / Diploma": "whose parents have an undergraduate degree or diploma",
      "Postgraduate or higher": "whose parents have a postgraduate or higher education"
    },
    fc4: {
      "Farming/Agriculture": "family's main income is from farming or agriculture",
      "Own Business/Entrepreneurship": "family is engaged in business or entrepreneurship",
      "Salaried Job": "family depends mainly on salaried jobs",
      "Daily Wage/Labor": "family relies on daily wage or labor work",
      "Other": "family has other sources of income"
    },
    fc5: {
      "Not supportive at all": "family is not supportive of higher education",
      "Somewhat supportive, but with reservations": "family is somewhat supportive of higher education, with some reservations",
      "Supportive within family circumstances": "family is supportive of higher education within their circumstances",
      "Very supportive and encouraging": "family is very supportive and encouraging towards higher education"
    },
    fc6: {
      "No, very limited or none": "had no professional role models in the family or social circle",
      "Some, but not in my immediate family": "had some professional role models in the extended family or social circle",
      "Yes, in my extended family/social circle": "had professional role models in the extended family/social circle",
      "Yes, in my immediate family": "had professional role models in the immediate family"
    },
    fc7: {
      "Regional language only": "primarily speaks a regional language at home",
      "Regional + Hindi/English": "speaks both regional language and Hindi/English at home",
      "Hindi only": "speaks Hindi only at home",
      "Hindi + English": "speaks Hindi and English at home",
      "English only": "speaks English only at home"
    },
    fc8: {
      "No, always lived in the same place": "family has always lived in the same place",
      "Yes, within the district/state": "family has relocated within the district or state",
      "Yes, to another state/region": "family has migrated to another state or region",
      "Yes, from rural to urban/metro": "family has migrated from rural to urban/metro areas"
    }
  };
  
  export function summarizeFamilyProfile(responses: FamilyContextResponse): string {
    // Build a readable summary
    let summaryParts: string[] = [];
    for (const key in responses) {
      const label = profileLabels[key]?.[responses[key]];
      if (label) summaryParts.push(label);
    }
    // Compose one or more summary sentences (customize as needed)
    const summary =
      "The student is " +
      summaryParts
        .filter(Boolean)
        .map((part, idx, arr) =>
          idx === arr.length - 1 && arr.length > 1 ? "and " + part : part
        )
        .join(", ") +
      ".";
  
    return summary;
  }
  
  // EXAMPLE USAGE
  // const exampleResponses = {
  //   fc1: "Middle Income",
  //   fc2: "City / Urban area",
  //   fc3: "Undergraduate degree / Diploma",
  //   fc4: "Salaried Job",
  //   fc5: "Supportive within family circumstances",
  //   fc6: "Some, but not in my immediate family",
  //   fc7: "Regional + Hindi/English",
  //   fc8: "No, always lived in the same place"
  // };
  // console.log(summarizeFamilyProfile(exampleResponses));