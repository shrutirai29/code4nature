import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, TreePine, Beef, Droplets, ArrowRight } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { formatRange, formatCurrency } from '../utils/calculations';
import ConfidenceIndicator from '../components/shared/ConfidenceIndicator';
import Disclaimer from '../components/shared/Disclaimer';
import Expandable from '../components/shared/Expandable';

export default function Baseline() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { panchayat, loadDemo } = useApp();

  useEffect(() => { if (!panchayat) loadDemo(); }, [panchayat, loadDemo]);

  if (!panchayat) return null;

  const flowSteps = [
    { icon: Layers, label: t('baseline.flowOpenData'), sub: t('baseline.flowOpenDataSub') },
    { icon: TreePine, label: t('baseline.flowLand'), sub: `${panchayat.agriculturalLand} ha + ${panchayat.commonLand} ha` },
    { icon: Beef, label: t('baseline.flowLivestock'), sub: `${panchayat.cattle} cattle + ${panchayat.buffalo} buffalo` },
    { icon: Droplets, label: t('baseline.flowSoil'), sub: `${panchayat.soilOrganicCarbon.toLocaleString()} t SOC` },
    { icon: Layers, label: t('baseline.flowEstimate'), sub: `${formatRange(panchayat.estimatedBaselineStock)} tCO₂e` },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900">{t('baseline.title')}</h1>
        <p className="text-sm text-charcoal-600 mt-1">{t('baseline.subtitle')}</p>
      </div>

      {/* Data flow visualization */}
      <div className="card">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-4">{t('baseline.estFlow')}</h3>
        <div className="flex flex-col md:flex-row items-stretch gap-0">
          {flowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex-1 flex flex-col items-center text-center px-3 py-4">
                <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center mb-2">
                  <step.icon size={18} className="text-forest-700" />
                </div>
                <span className="text-xs font-semibold text-charcoal-900">{step.label}</span>
                <span className="text-xs text-charcoal-600 mt-0.5">{step.sub}</span>
              </div>
              {i < flowSteps.length - 1 && (
                <div className="hidden md:block text-forest-400 text-lg">→</div>
              )}
              {i < flowSteps.length - 1 && (
                <div className="md:hidden text-forest-400 text-lg">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input data cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: t('baseline.inputLand'), value: `${(panchayat.agriculturalLand + panchayat.commonLand + panchayat.forestLand).toLocaleString()} ha`, detail: `${panchayat.agriculturalLand} ha ${t('baseline.inputLandDetail').split(',')[0]}, ${panchayat.commonLand} ha ${t('baseline.inputLandDetail').split(',')[1]}, ${panchayat.forestLand} ha ${t('baseline.inputLandDetail').split(',')[2]}` },
          { label: t('baseline.inputNDVI'), value: `${panchayat.vegetationIndex}/100`, detail: t('baseline.inputNDVIDetail') },
          { label: t('baseline.inputLivestock'), value: `${(panchayat.cattle + panchayat.buffalo + panchayat.goats + panchayat.sheep).toLocaleString()}`, detail: `${panchayat.cattle} cattle, ${panchayat.buffalo} buffalo, ${panchayat.goats} goats, ${panchayat.sheep} sheep` },
          { label: t('baseline.inputSOC'), value: `${panchayat.soilOrganicCarbon.toLocaleString()} t`, detail: t('baseline.inputSOCDetail') },
          { label: t('baseline.inputMGNREGA'), value: `${panchayat.mgnregaAssets}`, detail: `${panchayat.mgnregaWorkDays.toLocaleString()} ${t('baseline.inputMGNREGADetail')}` },
          { label: t('baseline.inputPop'), value: `${panchayat.population.toLocaleString()}`, detail: `${panchayat.households} ${t('baseline.inputPopDetail')}` },
        ].map((item) => (
          <div key={item.label} className="kpi-card">
            <div className="text-xs text-charcoal-600 mb-1">{item.label}</div>
            <div className="text-lg font-bold text-charcoal-900">{item.value}</div>
            <div className="text-xs text-charcoal-500 mt-1">{item.detail}</div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="card">
        <h3 className="font-semibold text-charcoal-900 mb-4">{t('baseline.results')}</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-earth-50 rounded-md p-5 border border-sage-200">
            <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('baseline.stock')}</div>
            <div className="text-2xl font-bold text-charcoal-900">{formatRange(panchayat.estimatedBaselineStock)} tCO₂e</div>
            <p className="text-xs text-charcoal-600 mt-2">{t('baseline.stockDesc')}</p>
          </div>
          <div className="bg-forest-50 rounded-md p-5 border border-forest-200">
            <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('baseline.sequestration')}</div>
            <div className="text-2xl font-bold text-forest-800">{formatRange(panchayat.carbonPotential.total)} tCO₂e/year</div>
            <p className="text-xs text-charcoal-600 mt-2">{t('baseline.seqDesc')}</p>
          </div>
        </div>
        <div className="mt-4">
          <ConfidenceIndicator level={panchayat.dataConfidence} />
        </div>
      </div>

      <Expandable title={t('baseline.howCalculated')} variant="info">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">{t('baseline.stockMethod')}</h4>
            <p className="text-xs text-charcoal-700">{t('baseline.stockMethodText')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">{t('baseline.seqMethod')}</h4>
            <p className="text-xs text-charcoal-700">{t('baseline.seqMethodText')}</p>
          </div>
          <Disclaimer message={t('baseline.screeningNote')} variant="info" />
        </div>
      </Expandable>

      <Disclaimer message={t('baseline.rangeNote')} />

      <div className="flex justify-end">
        <button onClick={() => navigate('/methodology')} className="btn-primary flex items-center gap-2">
          {t('common.next')}: {t('nav.methodology')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
