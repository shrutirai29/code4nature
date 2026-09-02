export interface CctsMethodology {
  methodologyCode: string;
  sector: string;
  name: string;
  nameHi: string;
  nameGu: string;
  status: 'approved' | 'pending';
  lastUpdated: string;
  officialReference: string;
  notes: string;
  requiredInputs: string[];
  screeningQuestions: string[];
  dataSources: string[];
  eligibleActivities: string[];
}

export const cctsMethodologies: CctsMethodology[] = [
  {
    methodologyCode: 'BM EN01.001',
    sector: 'Energy',
    name: 'Grid-connected electricity generation from renewable sources',
    nameHi: 'नवीकरणीय स्रोतों से ग्रिड-संयोजित बिजली उत्पादन',
    nameGu: 'નવીકરણીય સ્રોતોમાંથી ગ્રિડ-જોડાયેલ વીજળી ઉત્પાદન',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'For grid-connected renewable energy projects. Relevant if Panchayat land hosts solar/wind installations.',
    requiredInputs: ['Grid emission factor', 'Project generation data', 'Grid connection details', 'Baseline energy scenario'],
    screeningQuestions: ['Does the Panchayat host grid-connected renewable energy?', 'Is there a power purchase agreement?', 'What is the displacement factor?'],
    dataSources: ['CEA grid emission factors', 'Project generation metering', 'State electricity board data'],
    eligibleActivities: ['Solar PV installation', 'Wind energy', 'Small hydro', 'Biomass power'],
  },
  {
    methodologyCode: 'BM EN01.002',
    sector: 'Energy',
    name: 'Hydrogen production from electrolysis of water',
    nameHi: 'पानी के इलेक्ट्रोलिसिस से हाइड्रोजन उत्पादन',
    nameGu: 'પાણીના ઇલેક્ટ્રોલિસિસમાંથી હાઇડ્રોજન ઉત્પાદન',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Green hydrogen production. Typically not applicable at Panchayat level.',
    requiredInputs: ['Electrolyser capacity', 'Renewable energy source', 'Grid emission factor', 'Hydrogen production data'],
    screeningQuestions: ['Is there an electrolyser installation?', 'Is it powered by renewable energy?'],
    dataSources: ['Project specifications', 'Grid data'],
    eligibleActivities: ['Green hydrogen production'],
  },
  {
    methodologyCode: 'BM EN01.003',
    sector: 'Energy',
    name: 'Electricity and Heat Generation from Biomass',
    nameHi: 'बायोमास से बिजली और गर्मी उत्पादन',
    nameGu: 'બાયોમાસમાંથી વીજળી અને ગરમી ઉત્પાદન',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Biomass-based power and heat generation replacing fossil fuels.',
    requiredInputs: ['Biomass feedstock data', 'Displaced fuel type', 'Efficiency data', 'Baseline scenario'],
    screeningQuestions: ['Is biomass available locally?', 'What fossil fuel is displaced?', 'What is the efficiency gain?'],
    dataSources: ['Agricultural residue data', 'Energy consumption records'],
    eligibleActivities: ['Biomass power plant', 'Biomass boiler', 'Co-generation'],
  },
  {
    methodologyCode: 'BM IN02.001',
    sector: 'Industry',
    name: 'Energy efficiency and fuel switching measures for industrial facilities',
    nameHi: 'औद्योगिक सुविधाओं के लिए ऊर्जा दक्षता और ईंधन स्विचिंग',
    nameGu: 'ઔદ્યોગિક સુવિધાઓ માટે ઊર્જા કાર્યક્ષમતા અને ઇંધન સ્વિચિંગ',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Industrial energy efficiency improvements. Applicable if Panchayat area has small/medium enterprises.',
    requiredInputs: ['Baseline energy consumption', 'Efficiency improvement data', 'Fuel type data', 'Production data'],
    screeningQuestions: ['Are there industrial facilities in the Panchayat?', 'What energy efficiency measures are proposed?'],
    dataSources: ['Industrial energy audits', 'Production records'],
    eligibleActivities: ['Motor efficiency', 'Process heat recovery', 'Fuel switching', 'Waste heat recovery'],
  },
  {
    methodologyCode: 'BM IN02.002',
    sector: 'Industry',
    name: 'Hydrogen production using methane extracted from biogas',
    nameHi: 'बायोगैस से निकाले गए मीथेन का उपयोग करके हाइड्रोजन उत्पादन',
    nameGu: 'બાયોગેસમાંથી કાઢેલા મીથેનનો ઉપયોગ કરીને હાઇડ્રોજન ઉત્પાદન',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Hydrogen from biogas methane. May apply if biogas plants are operational.',
    requiredInputs: ['Biogas production data', 'Methane content', 'Hydrogen output', 'Energy source'],
    screeningQuestions: ['Are biogas plants operational in the area?', 'Is methane extraction feasible?'],
    dataSources: ['Biogas plant records', 'Gas composition data'],
    eligibleActivities: ['Biogas-based hydrogen production'],
  },
  {
    methodologyCode: 'BM WA03.001',
    sector: 'Waste',
    name: 'Landfill methane recovery',
    nameHi: 'लैंडफिल मीथेन वसूली',
    nameGu: 'લેન્ડફિલ મીથેન રિકવરી',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Methane capture from landfills. Relevant if Panchayat has managed waste sites.',
    requiredInputs: ['Landfill size and age', 'Waste composition', 'Methane generation rate', 'Capture efficiency'],
    screeningQuestions: ['Is there a managed landfill or waste site?', 'Is methane capture infrastructure present?'],
    dataSources: ['Municipal solid waste data', 'Landfill surveys'],
    eligibleActivities: ['Landfill gas capture', 'Landfill methane recovery systems'],
  },
  {
    methodologyCode: 'BM WA03.002',
    sector: 'Waste',
    name: 'Flaring or use of landfill gas',
    nameHi: 'लैंडफिल गैस का जलाना या उपयोग',
    nameGu: 'લેન્ડફિલ ગેસનું બાળવું અથવા ઉપયોગ',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Flaring or utilizing captured landfill gas.',
    requiredInputs: ['Gas composition', 'Flaring/utilization data', 'Baseline emissions'],
    screeningQuestions: ['Is landfill gas being captured?', 'How is it being used or flared?'],
    dataSources: ['Gas monitoring data', 'Landfill records'],
    eligibleActivities: ['Landfill gas flaring', 'Landfill gas to energy'],
  },
  {
    methodologyCode: 'BM WA03.003',
    sector: 'Waste',
    name: 'Production of Compressed Bio-gas (CBG)',
    nameHi: 'संपीड़ित बायोगैस (CBG) का उत्पादन',
    nameGu: 'સંકુચિત બાયોગેસ (CBG) નું ઉત્પાદન',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'CBG production from agricultural residue and organic waste. Relevant for Panchayats with biomass availability.',
    requiredInputs: ['Feedstock availability', 'CBG plant capacity', 'Displaced fossil fuel', 'Baseline scenario'],
    screeningQuestions: ['Is CBG production planned or operational?', 'Is agricultural residue available?', 'What fossil fuel does CBG displace?'],
    dataSources: ['Agricultural residue data', 'CBG plant specifications', 'SATAT scheme data'],
    eligibleActivities: ['CBG production from crop residue', 'CBG from cattle dung', 'CBG from municipal waste'],
  },
  {
    methodologyCode: 'BM AG04.001',
    sector: 'Agriculture',
    name: 'Methane recovery from livestock and manure management at households and small farms',
    nameHi: 'घरों और छोटे खेतों में पशुधन और मल प्रबंधन से मीथेन वसूली',
    nameGu: 'ઘરો અને નાના ખેતરોમાં પશુપાલન અને મળ વ્યવસ્થાપનમાંથી મીથેન રિકવરી',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Directly applicable to rural Panchayats with significant livestock. Methane recovery through biogas or improved manure management.',
    requiredInputs: ['Livestock population by species', 'Current manure management practices', 'Proposed improvement', 'Baseline methane emissions'],
    screeningQuestions: ['What is the livestock population?', 'How is manure currently managed?', 'What improvement is proposed (biogas, composting, etc.)?', 'What is the baseline methane emission factor?'],
    dataSources: ['Livestock Census', 'Farm surveys', 'Manure management records'],
    eligibleActivities: ['Biogas installation for cattle dung', 'Covered lagoon systems', 'Composting with methane capture', 'Improved manure storage'],
  },
  {
    methodologyCode: 'BM AG04.002',
    sector: 'Agriculture',
    name: 'Emission reduction through improved management practices in rice cultivation',
    nameHi: 'चावल की खेती में सुधारित प्रबंधन प्रथाओं के माध्यम से उत्सर्जन में कमी',
    nameGu: 'ચોખાની ખેતીમાં સુધારેલ વ્યવસ્થાપન પ્રથાઓ દ્વારા ઉત્સર્જન ઘટાડો',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Reduced methane from rice paddies through water management, alternate wetting and drying, improved varieties.',
    requiredInputs: ['Rice cultivation area', 'Current water management', 'Proposed practice change', 'Baseline emission factor', 'Yield data'],
    screeningQuestions: ['Is rice cultivation practiced?', 'What water management is currently used?', 'What improved practice is proposed?', 'What is the rice area in hectares?'],
    dataSources: ['Agricultural census', 'Crop survey data', 'Farm-level records'],
    eligibleActivities: ['Alternate wetting and drying (AWD)', 'Direct-seeded rice', 'Improved rice varieties', 'System of Rice Intensification (SRI)'],
  },
  {
    methodologyCode: 'BM FR05.001',
    sector: 'Forestry',
    name: 'Afforestation and reforestation of degraded mangrove habitats',
    nameHi: 'क्षीण मैंग्रोव आवासों का वनीकरण और पुनर्वनीकरण',
    nameGu: 'ક્ષીણ મેન્ગ્રોવ આવાસોનું વનીકરણ અને પુનઃવનીકરણ',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'Mangrove restoration. Only applicable to coastal Panchayats.',
    requiredInputs: ['Degraded mangrove area', 'Baseline land use', 'Planting plan', 'Species selection'],
    screeningQuestions: ['Is the Panchayat in a coastal area?', 'Are there degraded mangrove habitats?'],
    dataSources: ['CoalLine data', 'Satellite imagery', 'Forest surveys'],
    eligibleActivities: ['Mangrove plantation', 'Mangrove restoration'],
  },
  {
    methodologyCode: 'BM FR05.002',
    sector: 'Forestry',
    name: 'Afforestation and reforestation of lands except wetlands',
    nameHi: 'आर्द्रभूमि को छोड़कर भूमि का वनीकरण और पुनर्वनीकरण',
    nameGu: 'ભેજવાળી જમીન સિવાયની જમીનનું વનીકરણ અને પુનઃવનીકરણ',
    status: 'approved',
    lastUpdated: 'July 2026',
    officialReference: 'BEE CCTS Offset Methodology',
    notes: 'General A/R methodology for non-wetland areas. Applicable to Panchayats proposing tree planting on degraded agricultural or common land.',
    requiredInputs: ['Land area for A/R', 'Baseline land-use classification', 'Tree species and survival rates', 'Growth and carbon stock projections', 'Fire and pest risk assessment'],
    screeningQuestions: ['Is there degraded land suitable for A/R?', 'What species will be planted?', 'What is the 20-year growth projection?', 'How will the project avoid leakage?'],
    dataSources: ['Land records (cadastral)', 'Satellite land-use classification', 'Forest growth models', 'Feasibility studies'],
    eligibleActivities: ['Farm forestry', 'Community woodlot', 'Boundary planting', 'Degraded land restoration with trees'],
  },
];

export interface MethodologyMatchResult {
  methodologyCode: string;
  matchStatus: 'potential_match' | 'possible_match' | 'not_matched' | 'more_info_required' | 'carbon_opportunity_no_methodology';
  matchedCriteria: string[];
  missingInformation: string[];
  confidence: 'high' | 'medium' | 'low';
}

export function matchMethodologies(
  panchayat: {
    cattle: number;
    buffalo: number;
    goats: number;
    sheep: number;
    agriculturalLand: number;
    commonLand: number;
    carbonPotential: { agroforestry: [number, number]; livestock: [number, number]; landManagement: [number, number] };
  },
): MethodologyMatchResult[] {
  const results: MethodologyMatchResult[] = [];
  const totalLivestock = panchayat.cattle + panchayat.buffalo + panchayat.goats + panchayat.sheep;

  // BM AG04.001 - Livestock & Manure Management
  if (totalLivestock > 500) {
    results.push({
      methodologyCode: 'BM AG04.001',
      matchStatus: 'potential_match',
      matchedCriteria: [
        `Livestock population: ${totalLivestock.toLocaleString()} head`,
        'Household/small-farm activity present',
        'Manure management pathway identified',
      ],
      missingInformation: [
        'Baseline manure-management data',
        'Evidence of proposed project activity',
        'Detailed project boundary definition',
        'Verification and monitoring plan',
      ],
      confidence: 'medium',
    });
  } else if (totalLivestock > 100) {
    results.push({
      methodologyCode: 'BM AG04.001',
      matchStatus: 'more_info_required',
      matchedCriteria: [
        `Livestock population: ${totalLivestock.toLocaleString()} head (borderline)`,
      ],
      missingInformation: [
        'Larger livestock base may be needed',
        'Baseline manure-management data',
        'Detailed project documentation',
      ],
      confidence: 'low',
    });
  }

  // BM AG04.002 - Rice cultivation
  // Demo scenario: rice area exists in agricultural land
  const estimatedRiceArea = panchayat.agriculturalLand * 0.3; // ~30% rice in demo
  if (estimatedRiceArea > 50) {
    results.push({
      methodologyCode: 'BM AG04.002',
      matchStatus: 'potential_match',
      matchedCriteria: [
        `Estimated rice cultivation area: ~${Math.round(estimatedRiceArea)} ha`,
        'Improved rice management practices proposed',
        'Methane emission reduction pathway applicable',
      ],
      missingInformation: [
        'Actual rice cultivation area (ground-truthed)',
        'Current water management practices',
        'Proposed practice change documentation',
        'Yield and baseline emission data',
      ],
      confidence: 'medium',
    });
  }

  // BM FR05.002 - Afforestation/Reforestation
  if (panchayat.commonLand > 100 || panchayat.carbonPotential.agroforestry[1] > 300) {
    results.push({
      methodologyCode: 'BM FR05.002',
      matchStatus: 'potential_match',
      matchedCriteria: [
        `Common/degraded land: ${panchayat.commonLand} ha available`,
        `Agroforestry potential: ${panchayat.carbonPotential.agroforestry[0]}–${panchayat.carbonPotential.agroforestry[1]} tCO₂e/year`,
        'Tree planting activity identified',
      ],
      missingInformation: [
        'Specific tree species list required',
        '20-year growth projection needed',
        'Land-use documentation for project area',
        'Leakage assessment',
      ],
      confidence: 'medium',
    });
  }

  // BM WA03.003 - CBG (possible but needs data)
  if (totalLivestock > 800 && panchayat.agriculturalLand > 500) {
    results.push({
      methodologyCode: 'BM WA03.003',
      matchStatus: 'more_info_required',
      matchedCriteria: [
        'Sufficient biomass feedstock potential',
        'Livestock dung available as feedstock',
      ],
      missingInformation: [
        'No CBG plant identified',
        'SATAT scheme participation status unknown',
        'Feedstock logistics not assessed',
        'Displaced fuel analysis needed',
      ],
      confidence: 'low',
    });
  }

  // Agroforestry that doesn't clearly match FR05.002
  // Generic tree planting without formal A/R documentation
  results.push({
    methodologyCode: 'CARBON_OPPORTUNITY_GENERIC',
    matchStatus: 'carbon_opportunity_no_methodology',
    matchedCriteria: [
      'Tree planting and agroforestry activities observed',
      'Carbon sequestration potential estimated',
    ],
    missingInformation: [
      'No direct approved CCTS methodology match identified in current database for generic agroforestry without formal A/R documentation',
      'Requires detailed project assessment to determine applicable pathway',
    ],
    confidence: 'low',
  });

  return results;
}
