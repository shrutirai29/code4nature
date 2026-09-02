export interface RegulatorySnapshot {
  frameworkName: string;
  legalBasis: string;
  schemeName: string;
  mechanism: string;
  lastUpdated: string;
  methodologyVersion: string;
  methodologyLastUpdated: string;
  disclaimer: string;
  officialSources: {
    name: string;
    url: string;
    description: string;
  }[];
  institutionalRoles: {
    role: string;
    entity: string;
    description: string;
    entityAlt?: string;
  }[];
  projectCycle: {
    step: number;
    title: string;
    description: string;
    vasudhaRelevance: boolean;
  }[];
}

export const regulatorySnapshot: RegulatorySnapshot = {
  frameworkName: 'Indian Carbon Market',
  legalBasis: 'Energy Conservation (Amendment) Act, 2022',
  schemeName: 'Carbon Credit Trading Scheme (CCTS)',
  mechanism: 'Offset Mechanism',
  lastUpdated: 'July 2026',
  methodologyVersion: 'v2.1',
  methodologyLastUpdated: 'July 2026',
  disclaimer:
    'Rules and methodologies may change. Always verify the latest official BEE/CCTS documents before signing or registering a project.',
  officialSources: [
    {
      name: 'Bureau of Energy Efficiency (BEE)',
      url: 'https://beeindia.gov.in',
      description: 'CCTS / ICM Administrator — sets methodologies, accreditation rules, and operational procedures.',
    },
    {
      name: 'Carbon Credit Trading Scheme',
      url: 'https://eepINDIA.gov.in',
      description: 'The notified scheme under the EC Act 2022, governing compliance and offset mechanisms.',
    },
    {
      name: 'Central Electricity Authority (CEA)',
      url: 'https://cea.nic.in',
      description: 'Grid emission factors and electricity-sector methodology inputs.',
    },
    {
      name: 'CERC Carbon-Credit Trading Regulations',
      url: 'https://cercind.gov.in',
      description: 'Trading regulation and market oversight for carbon-credit certificates.',
    },
    {
      name: 'Accredited Carbon Verification Agencies',
      url: 'https://beeindia.gov.in/acva',
      description: 'Directory of agencies accredited for validation/verification under CCTS.',
    },
  ],
  institutionalRoles: [
    {
      role: 'Policy Oversight',
      entity: 'NSCICM',
      description: 'National Steering Committee on Indian Carbon Market — policy recommendations and framework oversight.',
    },
    {
      role: 'CCTS / ICM Administrator',
      entity: 'BEE',
      description: 'Bureau of Energy Efficiency — manages methodologies, project registration, and accreditation.',
    },
    {
      role: 'ICM Registry',
      entity: 'Grid Controller of India (POSOCO)',
      description: 'Maintains the registry of projects, CCCs, and crediting accounts.',
    },
    {
      role: 'Validation / Verification',
      entity: 'ACVAs',
      description: 'Accredited Carbon Verification Agencies — conduct independent project validation and periodic verification.',
    },
    {
      role: 'Trading Regulation',
      entity: 'CERC',
      description: 'Central Electricity Regulatory Commission — regulates carbon-credit trading on power exchanges.',
    },
    {
      role: 'CCC Trading',
      entity: 'Power Exchange / Trading Platform',
      description: 'Platforms where Carbon Credit Certificates are bought and sold.',
    },
    {
      role: 'Project Implementation',
      entity: 'Project Developer / Non-Obligated Entity',
      entityAlt: 'Gram Panchayat (through aggregator or independently)',
      description: 'Develops and implements the carbon project, bears project costs, and receives CCCs upon issuance.',
    },
  ],
  projectCycle: [
    {
      step: 1,
      title: 'Project Concept',
      description: 'Identify potential carbon project activities and assess basic feasibility.',
      vasudhaRelevance: false,
    },
    {
      step: 2,
      title: 'Screening by VASUDHA',
      description: 'Data-driven screening of methodology match, scale, and financial viability.',
      vasudhaRelevance: true,
    },
    {
      step: 3,
      title: 'Project Design / Documentation',
      description: 'Prepare Project Design Document (PDD) with baseline, methodology, and monitoring plan.',
      vasudhaRelevance: false,
    },
    {
      step: 4,
      title: 'Project Registration',
      description: 'Register the project with BEE under the applicable CCTS offset mechanism.',
      vasudhaRelevance: false,
    },
    {
      step: 5,
      title: 'Validation',
      description: 'Independent ACVA validates the project design and baseline.',
      vasudhaRelevance: false,
    },
    {
      step: 6,
      title: 'Monitoring',
      description: 'Ongoing monitoring of project activities and emission reductions/removals.',
      vasudhaRelevance: false,
    },
    {
      step: 7,
      title: 'Verification',
      description: 'ACVA verifies monitored emission reductions against the approved methodology.',
      vasudhaRelevance: false,
    },
    {
      step: 8,
      title: 'Issuance of CCCs',
      description: 'BEE issues Carbon Credit Certificates (1 CCC = 1 tCO₂e reduction/removal).',
      vasudhaRelevance: false,
    },
    {
      step: 9,
      title: 'Trading',
      description: 'CCCs can be traded on authorised power exchanges or through bilateral transactions.',
      vasudhaRelevance: false,
    },
  ],
};

export interface AcvaEntry {
  agency: string;
  accreditationStatus: 'FINAL' | 'PROVISIONAL';
  mechanism: string;
  relevantSectors: string[];
  validity: string;
}

export const acvaDirectory: AcvaEntry[] = [
  {
    agency: 'SGS India Pvt. Ltd.',
    accreditationStatus: 'FINAL',
    mechanism: 'CCTS Offset',
    relevantSectors: ['Renewable Energy', 'Waste Management', 'Agriculture', 'Forestry'],
    validity: 'Valid until March 2028',
  },
  {
    agency: 'Bureau Veritas India',
    accreditationStatus: 'FINAL',
    mechanism: 'CCTS Offset',
    relevantSectors: ['Industrial Energy Efficiency', 'Waste Management', 'Livestock'],
    validity: 'Valid until June 2027',
  },
  {
    agency: 'DNV India Pvt. Ltd.',
    accreditationStatus: 'FINAL',
    mechanism: 'CCTS Offset',
    relevantSectors: ['Renewable Energy', 'Afforestation/Reforestation', 'Agriculture'],
    validity: 'Valid until September 2028',
  },
  {
    agency: 'TUV SUD South Asia',
    accreditationStatus: 'PROVISIONAL',
    mechanism: 'CCTS Offset',
    relevantSectors: ['Industrial', 'Waste Management', 'Renewable Energy'],
    validity: 'Valid until December 2026',
  },
];
