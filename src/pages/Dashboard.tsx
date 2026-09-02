import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Leaf, TrendingUp, IndianRupee, Users, ArrowRight,
  BarChart3, Shield, ArrowDown,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { calculateViability, calculateDecisionScore, formatRange, formatCurrency, getDataConfidenceBreakdown } from '../utils/calculations';
import { methodologies } from '../data/demo';
import { matchMethodologies } from '../data/cctsMethodologies';
import { regulatorySnapshot } from '../data/regulatorySnapshot';
import KPICard from '../components/shared/KPICard';
import ConfidenceIndicator from '../components/shared/ConfidenceIndicator';
import Disclaimer from '../components/shared/Disclaimer';
import Expandable from '../components/shared/Expandable';
import MapView from '../components/Map/MapView';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { panchayat, viabilityInputs, loadDemo } = useApp();

  useEffect(() => {
    if (!panchayat) loadDemo();
  }, [panchayat, loadDemo]);

  if (!panchayat) return null;

  const viability = calculateViability(panchayat, viabilityInputs);
  const methodologyMatches = useMemo(() => matchMethodologies(panchayat), [panchayat]);
  const positiveMatches = methodologyMatches.filter(m => m.matchStatus === 'potential_match');
  const score = calculateDecisionScore(panchayat, viability, positiveMatches.length);
  const confidenceBreakdown = getDataConfidenceBreakdown(panchayat);

  const carbonData = [
    { name: t('carbon.agroforestry'), low: panchayat.carbonPotential.agroforestry[0], high: panchayat.carbonPotential.agroforestry[1] },
    { name: t('carbon.livestock'), low: panchayat.carbonPotential.livestock[0], high: panchayat.carbonPotential.livestock[1] },
    { name: t('carbon.landMgmt'), low: panchayat.carbonPotential.landManagement[0], high: panchayat.carbonPotential.landManagement[1] },
    ...(panchayat.carbonPotential.riceCultivation ? [{ name: t('carbon.rice'), low: panchayat.carbonPotential.riceCultivation[0], high: panchayat.carbonPotential.riceCultivation[1] }] : []),
  ];

  const overallLabel = {
    viable: t('dash.viable'),
    conditionally_viable: t('dash.viable'),
    marginal: t('dash.marginal'),
    not_viable: t('dash.notViable'),
  }[score.overall];

  const overallColor = {
    viable: 'text-forest-600 bg-forest-100 border-forest-300',
    conditionally_viable: 'text-amber-700 bg-amber-100 border-amber-300',
    marginal: 'text-amber-700 bg-amber-50 border-amber-200',
    not_viable: 'text-red-700 bg-red-50 border-red-200',
  }[score.overall];

  const readinessStatus = positiveMatches.length >= 2 && score.overall !== 'not_viable'
    ? 'POTENTIALLY ELIGIBLE'
    : positiveMatches.length >= 1
    ? 'MORE INFORMATION REQUIRED'
    : 'NO CURRENT METHODOLOGY MATCH';

  const getMethodName = (code: string) => t(`methName.${code}`) || code;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Regulatory snapshot bar */}
      <div className="flex items-center justify-between bg-earth-50 border border-sage-200 rounded-md px-4 py-2">
        <div className="flex items-center gap-3 text-xs text-charcoal-600">
          <span className="font-medium text-charcoal-900">{regulatorySnapshot.schemeName}</span>
          <span>•</span>
          <span>{t('dash.methodologyDb')}: {regulatorySnapshot.methodologyLastUpdated}</span>
        </div>
        <span className="text-xs text-charcoal-500">{t('dash.lastUpdated')}</span>
      </div>

      {/* Project Cycle Indicator */}
      <div className="card p-4">
        <h3 className="text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-3">{t('cycle.title')}</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {regulatorySnapshot.projectCycle.map((item, i) => (
            <div key={item.step} className="flex items-center">
              <div className={`px-2 py-1.5 rounded text-xs whitespace-nowrap ${
                item.vasudhaRelevance
                  ? 'bg-forest-700 text-white font-bold'
                  : item.step < 2
                  ? 'bg-sage-100 text-charcoal-500'
                  : 'bg-white border border-sage-200 text-charcoal-600'
              }`}>
                {item.step}. {t(`cycle.step${item.step}` as any) || item.title}
                {item.vasudhaRelevance && <span className="ml-1 text-amber-300">★</span>}
              </div>
              {i < regulatorySnapshot.projectCycle.length - 1 && (
                <ArrowRight size={10} className="text-charcoal-400 mx-0.5 shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-forest-700 font-bold">★ {t('cycle.youAreHere')} — Step 2: VASUDHA Screening</span>
          <span className="text-xs text-charcoal-500">|</span>
          <span className="text-xs text-charcoal-600">{t('disclaimer').split('.')[0]}.</span>
        </div>
      </div>

      {/* Viability Card */}
      <div className="card p-0 overflow-hidden">
        <div className="bg-forest-700 px-6 py-3">
          <h2 className="text-xs font-bold text-forest-100 uppercase tracking-wider">{t('dash.viability')}</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-base font-bold border ${overallColor}`}>
                {overallLabel}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-600">{t('dash.cctsReadiness')}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  readinessStatus === 'POTENTIALLY ELIGIBLE' ? 'text-forest-700 bg-forest-100' :
                  readinessStatus === 'MORE INFORMATION REQUIRED' ? 'text-amber-700 bg-amber-100' :
                  'text-charcoal-600 bg-sage-100'
                }`}>{readinessStatus}</span>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-xs text-charcoal-600">{t('dash.potentialMethod')}</span>
              <div className="text-sm font-bold text-charcoal-900">
                {positiveMatches.length > 0 ? `${positiveMatches[0].methodologyCode} — ${getMethodName(positiveMatches[0].methodologyCode)}` : t('dash.noMatch')}
              </div>
            </div>
            <div>
              <span className="text-xs text-charcoal-600">{t('dash.annually')}:</span>
              <div className="text-sm font-bold text-charcoal-900">{formatCurrency(viability.netRevenue[0])} – {formatCurrency(viability.netRevenue[1])}</div>
            </div>
            <div>
              <span className="text-xs text-charcoal-600">{t('dash.duration')}:</span>
              <div className="text-sm font-bold text-charcoal-900">{viabilityInputs.projectDuration} {langLabel(t)}</div>
            </div>
            <div>
              <span className="text-xs text-charcoal-600">{t('dash.households')}:</span>
              <div className="text-sm font-bold text-charcoal-900">{panchayat.households}</div>
            </div>
          </div>

          {/* Mitigation vs CCCs distinction */}
          <div className="bg-earth-50 border border-sage-200 rounded-md p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} className="text-forest-600" />
              <span className="text-xs font-semibold text-charcoal-900">{t('dash.screeningVsCCCs')}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div className="text-xs">
                <span className="text-charcoal-600">{t('dash.estMitigation')}</span>
                <span className="font-bold text-charcoal-900 ml-1">{viability.estimatedMitigationPotential[0]}–{viability.estimatedMitigationPotential[1]} tCO₂e/year</span>
              </div>
              <div className="text-xs">
                <span className="text-charcoal-600">{t('dash.potentialCCCs')} ({Math.round((viabilityInputs.creditableFraction ?? 0.75) * 100)}%{t('dash.fractionLabel')}</span>
                <span className="font-bold text-forest-800 ml-1">{viability.potentialIssuableCCCs[0]}–{viability.potentialIssuableCCCs[1]} CCCs/year</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-500 mt-1.5">{t('dash.creditingNote')}</p>
          </div>

          <div className="flex items-center gap-4">
            <ConfidenceIndicator level={panchayat.dataConfidence} />
            <button onClick={() => navigate('/viability')} className="btn-primary text-sm flex items-center gap-2 ml-auto">
              {t('dash.viewAnalysis')} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          label={t('kpi.mitigationPotential')}
          value={`${panchayat.carbonPotential.total[0]}–${panchayat.carbonPotential.total[1]} tCO₂e/yr`}
          tooltip={t('kpi.mitigationTip')}
          icon={<Leaf size={16} />}
        />
        <KPICard
          label={t('kpi.potentialCCCs')}
          value={`${viability.potentialIssuableCCCs[0]}–${viability.potentialIssuableCCCs[1]}/yr`}
          tooltip={t('kpi.cccsTip')}
          icon={<Shield size={16} />}
        />
        <KPICard
          label={t('kpi.grossRevenue')}
          value={`${formatCurrency(viability.grossRevenue[0])} – ${formatCurrency(viability.grossRevenue[1])}`}
          tooltip={t('kpi.grossTip')}
          icon={<TrendingUp size={16} />}
        />
        <KPICard
          label={t('kpi.netRevenue')}
          value={`${formatCurrency(viability.netRevenue[0])} – ${formatCurrency(viability.netRevenue[1])}`}
          tooltip={t('kpi.netTip')}
          icon={<IndianRupee size={16} />}
          accent="amber"
        />
        <KPICard
          label={t('kpi.perHousehold')}
          value={`${formatCurrency(viability.netPerHousehold[0])} – ${formatCurrency(viability.netPerHousehold[1])}`}
          tooltip={t('kpi.householdTip')}
          icon={<Users size={16} />}
        />
        <KPICard
          label={t('kpi.methodologyMatches')}
          value={`${positiveMatches.length}`}
          tooltip={t('kpi.methodTip')}
          icon={<BarChart3 size={16} />}
        />
      </div>

      {/* Methodology Quick Match */}
      <div className="card">
        <h3 className="font-semibold text-charcoal-900 mb-1">{t('dash.methodologyResults')}</h3>
        <p className="text-xs text-charcoal-600 mb-4">{t('dash.methodologySub')} {t('dash.methodologyDbRef')} ({regulatorySnapshot.methodologyLastUpdated})</p>
        <div className="space-y-2">
          {methodologyMatches.map((match) => {
            const methodName = getMethodName(match.methodologyCode);
            const statusColors = {
              potential_match: 'text-forest-700 bg-forest-100 border-forest-300',
              possible_match: 'text-amber-700 bg-amber-100 border-amber-300',
              more_info_required: 'text-info-blue bg-blue-50 border-blue-200',
              not_matched: 'text-charcoal-600 bg-sage-100 border-sage-300',
              carbon_opportunity_no_methodology: 'text-charcoal-700 bg-amber-50 border-amber-200',
            };
            const statusLabels: Record<string, string> = {
              potential_match: t('method.potentialMatch'),
              possible_match: t('method.possibleMatch'),
              more_info_required: t('method.moreInfoReq'),
              not_matched: t('method.noMatch'),
              carbon_opportunity_no_methodology: t('method.carbonOpp'),
            };
            return (
              <div key={match.methodologyCode} className={`flex items-start gap-3 p-3 rounded-md border ${statusColors[match.matchStatus]}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {match.methodologyCode !== 'CARBON_OPPORTUNITY_GENERIC' && <span className="font-bold text-sm">{match.methodologyCode}</span>}
                    <span className="text-xs text-charcoal-600">{methodName}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColors[match.matchStatus]}`}>
                      {statusLabels[match.matchStatus]}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {match.matchedCriteria.map((c, i) => (
                      <span key={i} className="text-xs text-forest-700">✓ {c}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Disclaimer message={t('method.disclaimer')} variant="info" />
      </div>

      {/* Carbon Potential Chart */}
      <div className="card">
        <h3 className="font-semibold text-charcoal-900 mb-1">{t('carbon.title')}</h3>
        <p className="text-xs text-charcoal-600 mb-4">{t('carbon.sub')}</p>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={carbonData} layout="vertical" barGap={2}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
              formatter={(value: unknown, name: unknown) => [`${value} tCO₂e`, name === 'low' ? t('dash.lowEstimate') : t('dash.highEstimate')]}
            />
            <Bar dataKey="low" fill="#68d391" name="low" radius={[0, 2, 2, 0]} />
            <Bar dataKey="high" fill="#276749" name="high" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-charcoal-600 font-medium">
            {t('carbon.total')}: {panchayat.carbonPotential.total[0].toLocaleString()} – {panchayat.carbonPotential.total[1].toLocaleString()} tCO₂e/year
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-forest-300 rounded" />
              <span className="text-xs text-charcoal-600">{t('dash.low')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-forest-700 rounded" />
              <span className="text-xs text-charcoal-600">{t('dash.high')}</span>
            </div>
          </div>
        </div>

        <Disclaimer message={t('carbon.disclaimer')} variant="info" />
      </div>

      {/* Decision Score */}
      <div className="card">
        <h3 className="font-semibold text-charcoal-900 mb-4">{t('dash.viabAssessment')}</h3>
        <div className="space-y-3 mb-6">
          {[
            { label: t('dash.carbonPotential'), value: score.carbonPotential },
            { label: t('dash.methodologyMatch'), value: score.methodologyMatch },
            { label: t('dash.projectScale'), value: score.projectScale },
            { label: t('dash.financialViability'), value: score.financialViability },
            { label: t('dash.dataConf'), value: score.dataConfidence },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-sm text-charcoal-700 w-40">{item.label}</span>
              <div className="flex-1 h-2.5 bg-sage-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500
                    ${item.value >= 7 ? 'bg-forest-500' : item.value >= 4 ? 'bg-amber-500' : 'bg-red-400'}`}
                  style={{ width: `${item.value * 10}%` }}
                />
              </div>
              <span className="text-xs text-charcoal-600 w-6 text-right">{item.value}/10</span>
            </div>
          ))}
        </div>

        <div className="bg-earth-50 rounded-md p-4 border border-sage-200">
          <h4 className="font-semibold text-sm text-charcoal-900 mb-2">{t('dash.whyThis')}</h4>
          <ol className="text-xs text-charcoal-700 space-y-1.5 list-decimal list-inside">
            {score.overall === 'conditionally_viable' && (
              <>
                <li>{t('dash.whyCond1')} ({positiveMatches.length} {t('dash.whyCond1b')}).</li>
                <li>{t('dash.whyCond2')} {panchayat.carbonPotential.total[0]}–{panchayat.carbonPotential.total[1]} {t('dash.whyCond2b')}</li>
                <li>{t('dash.whyCond3')}</li>
                <li>{t('dash.whyCond4')}</li>
                <li>{t('dash.whyCond5')}</li>
              </>
            )}
            {score.overall === 'viable' && (
              <>
                <li>{t('dash.whyViable1')}</li>
                <li>{t('dash.whyViable2')}</li>
                <li>{t('dash.whyViable3')}</li>
              </>
            )}
            {score.overall === 'marginal' && (
              <>
                <li>{t('dash.whyMarginal1')}</li>
                <li>{t('dash.whyMarginal2')}</li>
                <li>{t('dash.whyMarginal3')}</li>
              </>
            )}
          </ol>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        <button onClick={() => navigate('/methodology')} className="card card-hover text-left cursor-pointer">
          <h4 className="font-semibold text-sm text-charcoal-900 mb-1">{t('dash.quickMethod')}</h4>
          <p className="text-xs text-charcoal-600">{t('dash.quickMethodSub')}</p>
        </button>
        <button onClick={() => navigate('/readiness')} className="card card-hover text-left cursor-pointer">
          <h4 className="font-semibold text-sm text-charcoal-900 mb-1">{t('dash.quickReady')}</h4>
          <p className="text-xs text-charcoal-600">{t('dash.quickReadySub')}</p>
        </button>
        <button onClick={() => navigate('/viability')} className="card card-hover text-left cursor-pointer">
          <h4 className="font-semibold text-sm text-charcoal-900 mb-1">{t('dash.quickFin')}</h4>
          <p className="text-xs text-charcoal-600">{t('dash.quickFinSub')}</p>
        </button>
      </div>

      {/* Data Confidence Breakdown */}
      <Expandable title={t('dash.confBreakdown')} variant="info">
        <div className="space-y-2">
          {[
            { label: t('dash.confLand'), value: confidenceBreakdown.landUseData },
            { label: t('dash.confLivestock'), value: confidenceBreakdown.livestockData },
            { label: t('dash.confActivity'), value: confidenceBreakdown.projectActivityData },
            { label: t('dash.confMethod'), value: confidenceBreakdown.methodologyMatch },
            { label: t('dash.confSpatial'), value: confidenceBreakdown.spatialAccuracy },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-charcoal-700">{item.label}</span>
              <span className={`text-xs font-bold uppercase ${
                item.value === 'high' ? 'text-forest-600' :
                item.value === 'medium' ? 'text-amber-600' : 'text-red-500'
              }`}>{item.value}</span>
            </div>
          ))}
        </div>
      </Expandable>

      {/* Map View */}
      <MapView />

      <Disclaimer message={t('disclaimer')} />
    </div>
  );
}

function langLabel(t: (k: string) => string) {
  // Simple "years" label that works across languages
  return t('dash.duration').includes('year') ? 'years' : 'years';
}
