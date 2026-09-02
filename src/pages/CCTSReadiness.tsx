import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, CheckCircle, XCircle, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { matchMethodologies } from '../data/cctsMethodologies';
import Disclaimer from '../components/shared/Disclaimer';

interface ReadinessItem {
  labelKey: string;
  status: 'complete' | 'partial' | 'missing' | 'not_applicable';
  detailKey: string;
  detailValues?: Record<string, string | number>;
}

interface ReadinessCategory {
  id: string;
  titleKey: string;
  items: ReadinessItem[];
}

function renderDetail(t: (k: string) => string, key: string, values?: Record<string, string | number>) {
  let text = t(key);
  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export default function CCTSReadiness() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { panchayat, loadDemo } = useApp();

  useEffect(() => { if (!panchayat) loadDemo(); }, [panchayat, loadDemo]);

  const matchResults = useMemo(() => panchayat ? matchMethodologies(panchayat) : [], [panchayat]);
  const positiveMatches = matchResults.filter(m => m.matchStatus === 'potential_match');

  const readinessCategories: ReadinessCategory[] = useMemo(() => {
    if (!panchayat) return [];
    const totalLivestock = panchayat.cattle + panchayat.buffalo + panchayat.goats + panchayat.sheep;

    return [
      {
        id: 'concept',
        titleKey: 'readiness.catConcept',
        items: [
          { labelKey: 'readiness.itemActivity', status: 'complete', detailKey: 'readiness.detActivity', detailValues: { count: panchayat.potentialActivities?.length ?? 0 } },
          { labelKey: 'readiness.itemFeasibility', status: 'complete', detailKey: 'readiness.detFeasibility' },
          { labelKey: 'readiness.itemBoundary', status: 'missing', detailKey: 'readiness.detBoundary' },
          { labelKey: 'readiness.itemStakeholder', status: 'partial', detailKey: 'readiness.detStakeholder' },
        ],
      },
      {
        id: 'baseline',
        titleKey: 'readiness.catBaseline',
        items: [
          { labelKey: 'readiness.itemLand', status: 'complete', detailKey: 'readiness.detLandAgr' },
          { labelKey: 'readiness.itemLivestock', status: 'complete', detailKey: 'readiness.detLivestock' },
          { labelKey: 'readiness.itemBaselineInv', status: 'partial', detailKey: 'readiness.detBaselineInv' },
          { labelKey: 'readiness.itemHistorical', status: 'missing', detailKey: 'readiness.detHistorical' },
          { labelKey: 'readiness.itemBaselineDoc', status: 'missing', detailKey: 'readiness.detBaselineDoc' },
        ],
      },
      {
        id: 'additionality',
        titleKey: 'readiness.catAdditionality',
        items: [
          { labelKey: 'readiness.itemBaselineAssess', status: 'partial', detailKey: 'readiness.detBaselineAssess' },
          { labelKey: 'readiness.itemInvestment', status: 'missing', detailKey: 'readiness.detInvestment' },
          { labelKey: 'readiness.itemBarrier', status: 'missing', detailKey: 'readiness.detBarrier' },
          { labelKey: 'readiness.itemCommonPractice', status: 'missing', detailKey: 'readiness.detCommonPractice' },
        ],
      },
      {
        id: 'monitoring',
        titleKey: 'readiness.catMonitoring',
        items: [
          { labelKey: 'readiness.itemMonitorParams', status: 'partial', detailKey: 'readiness.detMonitorParams' },
          { labelKey: 'readiness.itemMonitorFreq', status: 'missing', detailKey: 'readiness.detMonitorFreq' },
          { labelKey: 'readiness.itemDataCollect', status: 'missing', detailKey: 'readiness.detDataCollect' },
          { labelKey: 'readiness.itemQA', status: 'missing', detailKey: 'readiness.detQA' },
        ],
      },
      {
        id: 'validation',
        titleKey: 'readiness.catValidation',
        items: [
          { labelKey: 'readiness.itemACVA', status: 'missing', detailKey: 'readiness.detACVA' },
          { labelKey: 'readiness.itemValDoc', status: 'missing', detailKey: 'readiness.detValDoc' },
          { labelKey: 'readiness.itemPublicConsult', status: 'missing', detailKey: 'readiness.detPublicConsult' },
        ],
      },
      {
        id: 'registration',
        titleKey: 'readiness.catRegistration',
        items: [
          { labelKey: 'readiness.itemBEEReg', status: 'partial', detailKey: 'readiness.detBEEReg' },
          { labelKey: 'readiness.itemRegFees', status: 'missing', detailKey: 'readiness.detRegFees' },
          { labelKey: 'readiness.itemProponent', status: 'partial', detailKey: 'readiness.detProponent' },
        ],
      },
      {
        id: 'community',
        titleKey: 'readiness.catCommunity',
        items: [
          { labelKey: 'readiness.itemGS', status: 'partial', detailKey: 'readiness.detGS' },
          { labelKey: 'readiness.itemGSConsent', status: 'missing', detailKey: 'readiness.detGSConsent' },
          { labelKey: 'readiness.itemContract', status: 'partial', detailKey: 'readiness.detContract' },
          { labelKey: 'readiness.itemRevenue', status: 'missing', detailKey: 'readiness.detRevenue' },
        ],
      },
    ];
  }, [panchayat]);

  if (!panchayat) return null;

  const overallStatus = positiveMatches.length >= 2 ? 'POTENTIALLY ELIGIBLE' : 'MORE INFORMATION REQUIRED';
  const overallColor = positiveMatches.length >= 2 ? 'text-forest-700 bg-forest-100 border-forest-300' : 'text-amber-700 bg-amber-100 border-amber-300';

  const totalItems = readinessCategories.reduce((s, c) => s + c.items.length, 0);
  const completedItems = readinessCategories.reduce((s, c) => s + c.items.filter(i => i.status === 'complete').length, 0);
  const partialItems = readinessCategories.reduce((s, c) => s + c.items.filter(i => i.status === 'partial').length, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900 flex items-center gap-2">
          <ClipboardCheck size={20} className="text-forest-700" />
          {t('readiness.title')}
        </h1>
        <p className="text-sm text-charcoal-600 mt-1">{t('readiness.subtitle')}</p>
      </div>

      {/* Overall Status */}
      <div className="card p-0 overflow-hidden">
        <div className="bg-forest-700 px-6 py-3">
          <h2 className="text-xs font-bold text-forest-100 uppercase tracking-wider">{t('readiness.status')}</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-base font-bold border ${overallColor}`}>
              {overallStatus}
            </span>
            <div className="text-right">
              <div className="text-xs text-charcoal-600">{t('readiness.score')}</div>
              <div className="text-lg font-bold text-charcoal-900">{completedItems}/{totalItems} {t('readiness.complete')}, {partialItems} {t('readiness.partial')}</div>
            </div>
          </div>

          <div className="h-3 bg-sage-100 rounded-full overflow-hidden mb-3">
            <div className="flex h-full">
              <div className="bg-forest-500 h-full" style={{ width: `${(completedItems / totalItems) * 100}%` }} />
              <div className="bg-amber-400 h-full" style={{ width: `${(partialItems / totalItems) * 100}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-charcoal-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-forest-500 rounded" /> {t('readiness.complete')}: {completedItems}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded" /> {t('readiness.partial')}: {partialItems}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-sage-300 rounded" /> {t('readiness.missing')}: {totalItems - completedItems - partialItems}</span>
          </div>
        </div>
      </div>

      {/* Methodology Matches */}
      <div className="card">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-3 flex items-center gap-2">
          <Shield size={16} className="text-forest-600" />
          {t('readiness.methodMatches')}
        </h3>
        <div className="space-y-2">
          {matchResults.filter(m => m.matchStatus === 'potential_match' || m.matchStatus === 'more_info_required').map((match) => (
            <div key={match.methodologyCode} className="flex items-center gap-3 p-2 rounded-md bg-earth-50 border border-sage-200">
              <span className="font-bold text-sm text-charcoal-900">{match.methodologyCode}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                match.matchStatus === 'potential_match' ? 'text-forest-700 bg-forest-100' : 'text-amber-700 bg-amber-100'
              }`}>
                {match.matchStatus === 'potential_match' ? t('readiness.potentialMatch') : t('readiness.moreInfoReq')}
              </span>
              <span className="text-xs text-charcoal-600">{match.matchedCriteria[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Readiness Categories */}
      <div className="space-y-4">
        {readinessCategories.map((category) => (
          <div key={category.id} className="card">
            <h3 className="font-semibold text-sm text-charcoal-900 mb-3">{t(category.titleKey)}</h3>
            <div className="space-y-2">
              {category.items.map((item) => (
                <div key={item.labelKey} className="flex items-start gap-3 p-2 rounded-md bg-earth-50/50">
                  <div className="mt-0.5 shrink-0">
                    {item.status === 'complete' && <CheckCircle size={14} className="text-forest-500" />}
                    {item.status === 'partial' && <AlertCircle size={14} className="text-amber-500" />}
                    {item.status === 'missing' && <XCircle size={14} className="text-red-400" />}
                    {item.status === 'not_applicable' && <span className="block w-3.5 h-3.5 rounded-full border border-sage-300" />}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm ${item.status === 'complete' ? 'text-forest-700 font-medium' : item.status === 'partial' ? 'text-charcoal-700' : 'text-charcoal-600'}`}>
                      {t(item.labelKey)}
                    </span>
                    <p className="text-xs text-charcoal-500 mt-0.5">{renderDetail(t, item.detailKey, item.detailValues)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    item.status === 'complete' ? 'text-forest-700 bg-forest-50' :
                    item.status === 'partial' ? 'text-amber-700 bg-amber-50' :
                    'text-red-600 bg-red-50'
                  }`}>
                    {item.status === 'complete' ? t('readiness.complete') : item.status === 'partial' ? t('readiness.partial') : t('readiness.missing')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additionality note */}
      <div className="card border-amber-300 bg-amber-50/50">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-700 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-amber-800 mb-1">{t('readiness.aboutAdd')}</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">{t('readiness.aboutAddText')}</p>
          </div>
        </div>
      </div>

      <Disclaimer message={t('readiness.disclaimer')} variant="info" />

      <div className="flex justify-between">
        <button onClick={() => navigate('/aggregation')} className="btn-secondary">
          ← {t('common.back')}
        </button>
        <button onClick={() => navigate('/decision')} className="btn-primary flex items-center gap-2">
          {t('common.next')}: {t('nav.decision')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
