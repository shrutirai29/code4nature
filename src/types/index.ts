export type Language = 'en' | 'hi' | 'gu';

export interface PanchayatData {
  id: string;
  name: string;
  block: string;
  district: string;
  state: string;
  population: number;
  households: number;
  agriculturalLand: number;
  commonLand: number;
  forestLand: number;
  cattle: number;
  buffalo: number;
  goats: number;
  sheep: number;
  poultry: number;
  mgnregaAssets: number;
  mgnregaWorkDays: number;
  soilOrganicCarbon: number;
  vegetationIndex: number;
  carbonPotential: {
    agroforestry: [number, number];
    livestock: [number, number];
    landManagement: [number, number];
    riceCultivation?: [number, number];
    total: [number, number];
  };
  estimatedBaselineStock: [number, number];
  dataConfidence: number;
  // CCTS-specific fields
  riceCultivationArea?: number;
  potentialActivities?: string[];
  nearbyRenewableEnergy?: boolean;
}

export interface NeighbouringPanchayat {
  name: string;
  distance: number;
  carbonPotential: [number, number];
  methodologyOverlap: string[];
  households: number;
  agriculturalLand: number;
}

export interface Methodology {
  id: string;
  name: string;
  nameHi: string;
  nameGu: string;
  description: string;
  eligibility: 'likely' | 'potential' | 'not_matched' | 'more_info';
  relevantData: string[];
  pathway: string;
  confidence: 'high' | 'medium' | 'low';
  requirements: { met: boolean; description: string }[];
}

export interface CarbonPriceScenario {
  label: string;
  price: number;
}

export interface ViabilityInputs {
  carbonPrices: CarbonPriceScenario[];
  projectDuration: number;
  verificationCost: number;
  monitoringCost: number;
  registrationCost: number;
  aggregatorMarginPercent: number;
  otherCosts: number;
  creditableFraction: number; // 0-1, portion of estimated mitigation that becomes issued CCCs
}

export interface ViabilityResult {
  grossRevenue: [number, number];
  totalCosts: [number, number];
  netRevenue: [number, number];
  netPerHousehold: [number, number];
  breakEvenPoint: number;
  estimatedMitigationPotential: [number, number];
  potentialIssuableCCCs: [number, number];
}

export interface DataSource {
  name: string;
  purpose: string;
  whyWeUse: string;
  lastUpdated: string;
  confidence: 'high' | 'medium' | 'low';
  icon: string;
}

export interface ContractChecklistItem {
  id: string;
  text: string;
  textHi: string;
  textGu: string;
  warning?: string;
}

export interface DecisionScore {
  carbonPotential: number;
  methodologyMatch: number;
  projectScale: number;
  financialViability: number;
  dataConfidence: number;
  overall: 'viable' | 'conditionally_viable' | 'marginal' | 'not_viable';
}

// CCTS Readiness
export type ReadinessStatus =
  | 'ready_for_assessment'
  | 'potentially_eligible'
  | 'more_information_required'
  | 'no_methodology_match'
  | 'not_currently_viable';

export interface ReadinessCheckItem {
  id: string;
  category: string;
  label: string;
  status: 'complete' | 'partial' | 'missing' | 'not_applicable';
  detail: string;
}

// Data confidence breakdown
export interface DataConfidenceBreakdown {
  overall: 'high' | 'medium' | 'low';
  landUseData: 'high' | 'medium' | 'low';
  livestockData: 'high' | 'medium' | 'low';
  projectActivityData: 'high' | 'medium' | 'low';
  methodologyMatch: 'high' | 'medium' | 'low';
  spatialAccuracy: 'high' | 'medium' | 'low';
}

// Contract transparency
export interface ContractQuestion {
  id: string;
  question: string;
  questionHi: string;
  questionGu: string;
  category: string;
  weight: number; // importance for scoring 1-3
}

export interface ContractTransparencyResult {
  score: number;
  maxScore: number;
  answeredCount: number;
  totalQuestions: number;
  warnings: string[];
}
