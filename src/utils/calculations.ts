import type {
  PanchayatData, ViabilityInputs, ViabilityResult, DecisionScore,
  NeighbouringPanchayat, ContractQuestion, ContractTransparencyResult,
  DataConfidenceBreakdown,
} from '../types';

export function calculateViability(
  panchayat: PanchayatData,
  inputs: ViabilityInputs,
  additionalHouseholds?: number,
  additionalCarbon?: [number, number],
): ViabilityResult {
  const carbon = panchayat.carbonPotential.total;
  const effectiveCarbon: [number, number] = additionalCarbon
    ? [carbon[0] + additionalCarbon[0], carbon[1] + additionalCarbon[1]]
    : carbon;

  // Estimated mitigation potential (raw)
  const estimatedMitigation: [number, number] = effectiveCarbon;

  // Potential issuable CCCs = mitigation × creditable fraction
  const creditableFraction = inputs.creditableFraction ?? 0.75;
  const potentialCCCs: [number, number] = [
    Math.round(effectiveCarbon[0] * creditableFraction),
    Math.round(effectiveCarbon[1] * creditableFraction),
  ];

  const lowPrice = inputs.carbonPrices[0].price;
  const highPrice = inputs.carbonPrices[2].price;
  const duration = inputs.projectDuration;

  // Annual gross revenue (based on potential issuable CCCs, not raw mitigation)
  const annualGrossLow = potentialCCCs[0] * lowPrice;
  const annualGrossHigh = potentialCCCs[1] * highPrice;

  // Annual costs (one-time costs amortised over project duration)
  const annualVerificationLow = inputs.verificationCost / duration;
  const annualVerificationHigh = (inputs.verificationCost * 1.2) / duration;
  const annualRegistrationLow = inputs.registrationCost / duration;
  const annualOtherLow = inputs.otherCosts / duration;
  const annualOtherHigh = (inputs.otherCosts * 1.3) / duration;

  // Annual total costs
  const annualCostsLow = annualVerificationLow + inputs.monitoringCost + annualRegistrationLow + annualOtherLow;
  const annualCostsHigh = annualVerificationHigh + (inputs.monitoringCost * 1.1) + annualRegistrationLow + annualOtherHigh;

  // Aggregator margin (annual)
  const annualMarginLow = annualGrossLow * (inputs.aggregatorMarginPercent / 100);
  const annualMarginHigh = annualGrossHigh * (inputs.aggregatorMarginPercent / 100);

  // Net annual revenue
  const netAnnualLow = annualGrossLow - annualCostsLow - annualMarginLow;
  const netAnnualHigh = annualGrossHigh - annualCostsHigh - annualMarginHigh;

  const totalHouseholds = panchayat.households + (additionalHouseholds ?? 0);
  const netPerHouseholdLow = netAnnualLow / totalHouseholds;
  const netPerHouseholdHigh = netAnnualHigh / totalHouseholds;

  // Break-even: carbon quantity needed to cover annual costs at mid price
  const midPrice = inputs.carbonPrices[1].price;
  const annualFixedCosts = annualCostsLow;
  const netPricePerCredit = midPrice * (1 - inputs.aggregatorMarginPercent / 100);
  const breakEvenPoint = netPricePerCredit > 0 ? Math.ceil(annualFixedCosts / netPricePerCredit) : 9999;

  return {
    grossRevenue: [annualGrossLow, annualGrossHigh],
    totalCosts: [annualCostsLow, annualCostsHigh],
    netRevenue: [Math.max(netAnnualLow, 0), Math.max(netAnnualHigh, 0)],
    netPerHousehold: [Math.max(netPerHouseholdLow, 0), Math.max(netPerHouseholdHigh, 0)],
    breakEvenPoint,
    estimatedMitigationPotential: estimatedMitigation,
    potentialIssuableCCCs: potentialCCCs,
  };
}

export function calculateDecisionScore(
  panchayat: PanchayatData,
  viability: ViabilityResult,
  methodologyMatches: number,
): DecisionScore {
  const avgCarbon = (panchayat.carbonPotential.total[0] + panchayat.carbonPotential.total[1]) / 2;
  const carbonScore = Math.min(10, Math.round(avgCarbon / 120));
  const methodologyScore = Math.min(10, methodologyMatches * 3);
  const scaleScore = Math.min(10, Math.round(avgCarbon / 100));
  const financialScore = viability.netRevenue[1] > 0 ? Math.min(10, Math.round(viability.netRevenue[1] / 50000)) : 2;
  const confidenceScore = panchayat.dataConfidence * 2;

  const overall = (
    (carbonScore >= 7 && methodologyScore >= 6 && financialScore >= 5) ? 'viable' as const :
    (carbonScore >= 5 && methodologyScore >= 4 && financialScore >= 3) ? 'conditionally_viable' as const :
    (carbonScore >= 3 || financialScore >= 2) ? 'marginal' as const :
    'not_viable' as const
  );

  return {
    carbonPotential: carbonScore,
    methodologyMatch: methodologyScore,
    projectScale: scaleScore,
    financialViability: financialScore,
    dataConfidence: confidenceScore,
    overall,
  };
}

export function calculateContractTransparency(
  questions: ContractQuestion[],
  answers: Map<string, boolean>,
): ContractTransparencyResult {
  let score = 0;
  let maxScore = 0;
  let answeredCount = 0;
  const warnings: string[] = [];

  for (const q of questions) {
    maxScore += q.weight;
    const answered = answers.get(q.id);
    if (answered) {
      score += q.weight;
      answeredCount++;
    } else {
      if (q.weight === 3) {
        warnings.push(`Critical: "${q.question}" not addressed`);
      }
    }
  }

  return {
    score,
    maxScore,
    answeredCount,
    totalQuestions: questions.length,
    warnings,
  };
}

export function getDataConfidenceBreakdown(panchayat: PanchayatData): DataConfidenceBreakdown {
  return {
    overall: panchayat.dataConfidence >= 4 ? 'high' : panchayat.dataConfidence >= 3 ? 'medium' : 'low',
    landUseData: 'high',
    livestockData: panchayat.dataConfidence >= 3 ? 'medium' : 'low',
    projectActivityData: 'low',
    methodologyMatch: 'medium',
    spatialAccuracy: 'medium',
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} lakh`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
}

export function formatRange(range: [number, number]): string {
  return `${formatCurrency(range[0])} – ${formatCurrency(range[1])}`;
}

export function getCombinedPotential(
  panchayat: PanchayatData,
  selected: NeighbouringPanchayat[],
): { carbon: [number, number]; households: number } {
  const carbon: [number, number] = [
    panchayat.carbonPotential.total[0] + selected.reduce((s, p) => s + p.carbonPotential[0], 0),
    panchayat.carbonPotential.total[1] + selected.reduce((s, p) => s + p.carbonPotential[1], 0),
  ];
  const households = panchayat.households + selected.reduce((s, p) => s + p.households, 0);
  return { carbon, households };
}
