import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import { Calculator, ArrowRight, Settings, Shield, AlertTriangle, Scale } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { calculateViability, formatCurrency } from '../utils/calculations';
import Disclaimer from '../components/shared/Disclaimer';

export default function Viability() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { panchayat, viabilityInputs, setViabilityInputs, selectedNeighbours, loadDemo } = useApp();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => { if (!panchayat) loadDemo(); }, [panchayat, loadDemo]);

  if (!panchayat) return null;

  const viability = useMemo(() => {
    const extraCarbon: [number, number] | undefined = selectedNeighbours.length > 0
      ? [selectedNeighbours.reduce((s, n) => s + n.carbonPotential[0], 0), selectedNeighbours.reduce((s, n) => s + n.carbonPotential[1], 0)]
      : undefined;
    const extraHouseholds = selectedNeighbours.reduce((s, n) => s + n.households, 0);
    return calculateViability(panchayat, viabilityInputs, extraHouseholds || undefined, extraCarbon);
  }, [panchayat, viabilityInputs, selectedNeighbours]);

  const breakEvenData = useMemo(() => {
    const data: { carbonPrice: number; netRevenue: number }[] = [];
    const avgCCCs = (viability.potentialIssuableCCCs[0] + viability.potentialIssuableCCCs[1]) / 2;
    for (let price = 200; price <= 2000; price += 100) {
      const grossRevenue = avgCCCs * price;
      const totalCosts = viabilityInputs.verificationCost + viabilityInputs.monitoringCost + viabilityInputs.registrationCost + viabilityInputs.otherCosts;
      const aggregatorMargin = grossRevenue * (viabilityInputs.aggregatorMarginPercent / 100);
      const netRevenue = grossRevenue - totalCosts - aggregatorMargin;
      data.push({ carbonPrice: price, netRevenue: netRevenue / 100000 });
    }
    return data;
  }, [viability, viabilityInputs]);

  const breakEvenPrice = useMemo(() => {
    const avgCCCs = (viability.potentialIssuableCCCs[0] + viability.potentialIssuableCCCs[1]) / 2;
    const totalCosts = viabilityInputs.verificationCost + viabilityInputs.monitoringCost + viabilityInputs.registrationCost + viabilityInputs.otherCosts;
    return avgCCCs > 0 ? totalCosts / (avgCCCs * (1 - viabilityInputs.aggregatorMarginPercent / 100)) : 9999;
  }, [viability, viabilityInputs]);

  const midGross = (viability.grossRevenue[0] + viability.grossRevenue[1]) / 2;
  const aggregatorShare = midGross * (viabilityInputs.aggregatorMarginPercent / 100);
  const avgCosts = (viability.totalCosts[0] + viability.totalCosts[1]) / 2;
  const verificationMRV = (viabilityInputs.verificationCost / viabilityInputs.projectDuration) + viabilityInputs.monitoringCost;
  const otherProjectCosts = (viabilityInputs.registrationCost / viabilityInputs.projectDuration) + viabilityInputs.otherCosts;
  const communityShare = midGross - aggregatorShare - avgCosts;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: number }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-charcoal-900 text-white px-3 py-2 rounded-md text-xs">
        <div className="font-medium">₹{label}/tCO₂e</div>
        <div className="text-sage-300">Net: ₹{(payload[0].value).toFixed(1)} lakh/yr</div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900 flex items-center gap-2">
          <Calculator size={20} className="text-forest-700" />
          {t('viab.title')}
        </h1>
        <p className="text-sm text-charcoal-600 mt-1">{t('viab.subtitle')}</p>
      </div>

      {/* Mitigation vs CCCs distinction */}
      <div className="card bg-earth-50 border-sage-200">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-forest-600" />
          <h3 className="font-semibold text-sm text-charcoal-900">{t('viab.mitVsCcc')}</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('viab.mitigation')}</div>
            <div className="text-lg font-bold text-charcoal-900">
              {viability.estimatedMitigationPotential[0]}–{viability.estimatedMitigationPotential[1]} tCO₂e/yr
            </div>
            <div className="text-xs text-charcoal-600 mt-0.5">{t('viab.rawScreen')}</div>
          </div>
          <div>
            <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('viab.fraction')}</div>
            <div className="text-lg font-bold text-forest-800">
              {Math.round((viabilityInputs.creditableFraction ?? 0.75) * 100)}%
            </div>
            <div className="text-xs text-charcoal-600 mt-0.5">{t('viab.notAllbecomes')}</div>
          </div>
          <div>
            <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('viab.cccs')}</div>
            <div className="text-lg font-bold text-forest-800">
              {viability.potentialIssuableCCCs[0]}–{viability.potentialIssuableCCCs[1]}/yr
            </div>
            <div className="text-xs text-charcoal-600 mt-0.5">{t('viab.subjectTo')}</div>
          </div>
        </div>
        <p className="text-xs text-charcoal-500 mt-2">{t('viab.fractionNote')}</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-forest-50 border border-forest-200 rounded-lg p-5">
          <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('viab.grossRevenue')}</div>
          <div className="text-xl font-bold text-forest-800">
            {formatCurrency(viability.grossRevenue[0])} – {formatCurrency(viability.grossRevenue[1])}
          </div>
          <div className="text-xs text-charcoal-600 mt-1">{t('viab.perYearFrom')}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('viab.costs')}</div>
          <div className="text-xl font-bold text-amber-800">
            {formatCurrency(viability.totalCosts[0])} – {formatCurrency(viability.totalCosts[1])}
          </div>
          <div className="text-xs text-charcoal-600 mt-1">{t('viab.perYearIncl')}</div>
        </div>
        <div className="bg-white border border-forest-300 rounded-lg p-5">
          <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('viab.netRevenue')}</div>
          <div className="text-xl font-bold text-charcoal-900">
            {formatCurrency(viability.netRevenue[0])} – {formatCurrency(viability.netRevenue[1])}
          </div>
          <div className="text-xs text-charcoal-600 mt-1">{t('viab.perYearTo')}</div>
          <div className="text-xs font-semibold text-forest-700 mt-1">
            {formatCurrency(viability.netPerHousehold[0])} – {formatCurrency(viability.netPerHousehold[1])} {t('viab.perHHYear')}
          </div>
        </div>
      </div>

      {/* Aggregator Economics Breakdown */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-charcoal-900 flex items-center gap-2">
            <Scale size={16} className="text-charcoal-600" />
            {t('viab.aggBreakdown')}
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { label: t('viab.grossProjectVal'), value: midGross, color: 'text-charcoal-900', bg: 'bg-forest-50' },
            { label: `${t('viab.aggShare')} (${viabilityInputs.aggregatorMarginPercent}%)`, value: -aggregatorShare, color: 'text-red-600', bg: 'bg-red-50' },
            { label: t('viab.verifMRV'), value: -verificationMRV, color: 'text-red-600', bg: 'bg-red-50' },
            { label: t('viab.otherCosts'), value: -otherProjectCosts, color: 'text-red-600', bg: 'bg-red-50' },
            { label: t('viab.communityShare'), value: communityShare, color: 'text-forest-800', bg: 'bg-forest-50', bold: true },
          ].map((item) => (
            <div key={item.label} className={`flex items-center justify-between p-3 rounded-md ${item.bg} ${item.bold ? 'border border-forest-300' : ''}`}>
              <span className={`text-sm ${item.bold ? 'font-semibold' : ''} text-charcoal-700`}>{item.label}</span>
              <span className={`text-sm font-bold ${item.color}`}>
                {item.value < 0 ? '−' : ''}{formatCurrency(Math.abs(item.value))}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-700 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800">{t('viab.compareWarning')}</p>
        </div>
      </div>

      {/* Contract Comparison */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-charcoal-900">{t('viab.compareContracts')}</h3>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-xs text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1"
          >
            <Settings size={12} />
            {showComparison ? t('viab.hideComp') : t('viab.showComp')}
          </button>
        </div>
        {showComparison && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-sage-200">
                  <th className="text-left py-2 pr-4 text-charcoal-600 font-medium">{t('viab.term')}</th>
                  <th className="text-left py-2 px-4 text-charcoal-600 font-medium bg-forest-50">{t('viab.aggA')}</th>
                  <th className="text-left py-2 px-4 text-charcoal-600 font-medium bg-earth-50">{t('viab.aggB')}</th>
                  <th className="text-left py-2 pl-4 text-charcoal-600 font-medium bg-amber-50">{t('viab.communityLed')}</th>
                </tr>
              </thead>
              <tbody className="text-charcoal-700">
                {[
                  { term: t('viab.termDuration'), a: '10 years', b: '7 years', c: '5 years' },
                  { term: t('viab.termRevenue'), a: `${viabilityInputs.aggregatorMarginPercent}% to aggregator`, b: '25% to aggregator', c: '10% admin cost' },
                  { term: t('viab.termFees'), a: 'None', b: '₹2 lakh upfront', c: '₹1.5 lakh upfront' },
                  { term: t('viab.termVerif'), a: 'Aggregator', b: 'Shared', c: 'Community (with support)' },
                  { term: t('viab.termMonitor'), a: 'Aggregator', b: 'Shared', c: 'Community' },
                  { term: t('viab.termExit'), a: 'Penalty after year 3', b: '6-month notice', c: 'Annual renewal' },
                  { term: t('viab.termCCC'), a: 'Aggregator', b: 'Joint', c: 'Community' },
                  { term: t('viab.termPayment'), a: 'Post-issuance only', b: 'Annual advance', c: 'Post-issuance' },
                ].map((row) => (
                  <tr key={row.term} className="border-b border-sage-100">
                    <td className="py-2 pr-4 font-medium">{row.term}</td>
                    <td className="py-2 px-4 bg-forest-50/50">{row.a}</td>
                    <td className="py-2 px-4 bg-earth-50/50">{row.b}</td>
                    <td className="py-2 pl-4 bg-amber-50/50">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Input sliders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-charcoal-900">{t('viab.adjustParamsTitle')}</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1"
          >
            <Settings size={12} />
            {showAdvanced ? t('viab.hideAdv') : t('viab.showAdv')}
          </button>
        </div>

        <div className="space-y-5">
          {/* Creditable fraction */}
          <div>
            <label className="text-xs font-medium text-charcoal-700 mb-1 block">
              {t('viab.creditFraction')} <span className="text-charcoal-900 font-bold">{Math.round((viabilityInputs.creditableFraction ?? 0.75) * 100)}%</span>
            </label>
            <p className="text-xs text-charcoal-500 mb-1">{t('viab.creditFractionDesc')}</p>
            <input
              type="range"
              min={50}
              max={100}
              value={Math.round((viabilityInputs.creditableFraction ?? 0.75) * 100)}
              onChange={(e) => setViabilityInputs({ ...viabilityInputs, creditableFraction: Number(e.target.value) / 100 })}
              className="w-full accent-forest-700"
            />
            <div className="flex justify-between text-xs text-charcoal-500">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Carbon prices */}
          <div>
            <label className="text-xs font-medium text-charcoal-700 mb-2 block">{t('viab.carbonPrices')}</label>
            <div className="grid grid-cols-3 gap-3">
              {viabilityInputs.carbonPrices.map((scenario, i) => (
                <div key={scenario.label}>
                  <div className="text-xs text-charcoal-600 mb-1">{scenario.label}</div>
                  <input
                    type="number"
                    value={scenario.price}
                    onChange={(e) => {
                      const newPrices = [...viabilityInputs.carbonPrices];
                      newPrices[i] = { ...newPrices[i], price: Number(e.target.value) };
                      setViabilityInputs({ ...viabilityInputs, carbonPrices: newPrices });
                    }}
                    className="w-full px-2 py-1.5 border border-sage-200 rounded text-sm focus:outline-none focus:border-forest-500"
                    min={0}
                    step={50}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project duration */}
          <div>
            <label className="text-xs font-medium text-charcoal-700 mb-1 block">
              {t('viab.projectDuration')} <span className="text-charcoal-900 font-bold">{viabilityInputs.projectDuration} years</span>
            </label>
            <input
              type="range"
              min={5}
              max={25}
              value={viabilityInputs.projectDuration}
              onChange={(e) => setViabilityInputs({ ...viabilityInputs, projectDuration: Number(e.target.value) })}
              className="w-full accent-forest-700"
            />
            <div className="flex justify-between text-xs text-charcoal-500">
              <span>5 years</span>
              <span>25 years</span>
            </div>
          </div>

          {/* Aggregator margin */}
          <div>
            <label className="text-xs font-medium text-charcoal-700 mb-1 block">
              {t('viab.aggCommission')} <span className="text-charcoal-900 font-bold">{viabilityInputs.aggregatorMarginPercent}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={50}
              value={viabilityInputs.aggregatorMarginPercent}
              onChange={(e) => setViabilityInputs({ ...viabilityInputs, aggregatorMarginPercent: Number(e.target.value) })}
              className="w-full accent-forest-700"
            />
            <div className="flex justify-between text-xs text-charcoal-500">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          {showAdvanced && (
            <>
              <div>
                <label className="text-xs font-medium text-charcoal-700 mb-1 block">
                  {t('viab.verifCost')} {formatCurrency(viabilityInputs.verificationCost)}
                </label>
                <input
                  type="range"
                  min={200000}
                  max={2000000}
                  step={50000}
                  value={viabilityInputs.verificationCost}
                  onChange={(e) => setViabilityInputs({ ...viabilityInputs, verificationCost: Number(e.target.value) })}
                  className="w-full accent-forest-700"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-charcoal-700 mb-1 block">
                  {t('viab.monitorCost')} {formatCurrency(viabilityInputs.monitoringCost)}
                </label>
                <input
                  type="range"
                  min={100000}
                  max={1000000}
                  step={50000}
                  value={viabilityInputs.monitoringCost}
                  onChange={(e) => setViabilityInputs({ ...viabilityInputs, monitoringCost: Number(e.target.value) })}
                  className="w-full accent-forest-700"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-charcoal-700 mb-1 block">
                  {t('viab.regCost')} {formatCurrency(viabilityInputs.registrationCost)}
                </label>
                <input
                  type="range"
                  min={100000}
                  max={1000000}
                  step={50000}
                  value={viabilityInputs.registrationCost}
                  onChange={(e) => setViabilityInputs({ ...viabilityInputs, registrationCost: Number(e.target.value) })}
                  className="w-full accent-forest-700"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-charcoal-700 mb-1 block">
                  {t('viab.otherCost')} {formatCurrency(viabilityInputs.otherCosts)}
                </label>
                <input
                  type="range"
                  min={50000}
                  max={500000}
                  step={25000}
                  value={viabilityInputs.otherCosts}
                  onChange={(e) => setViabilityInputs({ ...viabilityInputs, otherCosts: Number(e.target.value) })}
                  className="w-full accent-forest-700"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Break-even chart */}
      <div className="card">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-1">{t('viab.breakEvenTitle')}</h3>
        <p className="text-xs text-charcoal-600 mb-4">{t('viab.breakEvenChart')}</p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={breakEvenData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="carbonPrice"
              tick={{ fontSize: 11 }}
              label={{ value: 'Carbon Price (₹/tCO₂e)', position: 'bottom', offset: -5, fontSize: 11 }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              label={{ value: 'Net Revenue (₹ lakh/yr)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#a0aec0" strokeDasharray="3 3" />
            <ReferenceLine
              x={Math.round(breakEvenPrice / 100) * 100}
              stroke="#d69e2e"
              strokeDasharray="5 5"
              label={{ value: `Break-even ~₹${Math.round(breakEvenPrice)}`, position: 'top', fontSize: 11, fill: '#d69e2e' }}
            />
            <Line
              type="monotone"
              dataKey="netRevenue"
              stroke="#276749"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#276749' }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-xs text-red-700 font-medium">{t('viab.belowBE')} (~₹{Math.round(breakEvenPrice)}/tCO₂e)</p>
            <p className="text-xs text-red-600 mt-1">{t('viab.belowBEDesc')}</p>
          </div>
          <div className="bg-forest-50 border border-forest-200 rounded-md p-3">
            <p className="text-xs text-forest-700 font-medium">{t('viab.aboveBE')}</p>
            <p className="text-xs text-forest-600 mt-1">{t('viab.aboveBEDesc')}</p>
          </div>
        </div>

        <div className="mt-4 bg-earth-50 border border-sage-200 rounded-md p-3">
          <p className="text-xs text-charcoal-700 leading-relaxed">
            {t('viab.interpretation')} ~₹{Math.round(breakEvenPrice)}{t('viab.interpretation2')}
            {t('viab.interpretation3')}
          </p>
        </div>
      </div>

      <Disclaimer message={t('disclaimerFinancial')} />

      <div className="flex justify-between">
        <button onClick={() => navigate('/methodology')} className="btn-secondary">
          ← {t('common.back')}
        </button>
        <button onClick={() => navigate('/aggregation')} className="btn-primary flex items-center gap-2">
          {t('common.next')}: {t('nav.aggregation')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
