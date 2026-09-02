import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, HelpCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { cctsMethodologies, matchMethodologies } from '../data/cctsMethodologies';
import { regulatorySnapshot } from '../data/regulatorySnapshot';
import Disclaimer from '../components/shared/Disclaimer';

const matchStatusConfig: Record<string, { labelKey: string; color: string }> = {
  potential_match: { labelKey: 'method.potentialMatch', color: 'text-forest-700 bg-forest-100 border-forest-300' },
  possible_match: { labelKey: 'method.possibleMatch', color: 'text-amber-700 bg-amber-100 border-amber-300' },
  more_info_required: { labelKey: 'method.moreInfoReq', color: 'text-info-blue bg-blue-50 border-blue-200' },
  not_matched: { labelKey: 'method.noMatch', color: 'text-charcoal-600 bg-sage-100 border-sage-300' },
  carbon_opportunity_no_methodology: { labelKey: 'method.carbonOpp', color: 'text-charcoal-700 bg-amber-50 border-amber-200' },
};

export default function Methodology() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { panchayat, loadDemo } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { if (!panchayat) loadDemo(); }, [panchayat, loadDemo]);

  const matchResults = useMemo(() => panchayat ? matchMethodologies(panchayat) : [], [panchayat]);
  const matchedCodes = useMemo(() => new Set(matchResults.map(m => m.methodologyCode)), [matchResults]);

  if (!panchayat) return null;

  const getMethodName = (code: string) => t(`methName.${code}`) || code;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900">{t('method.title')}</h1>
        <p className="text-sm text-charcoal-600 mt-1">{t('method.subtitle')}</p>
      </div>

      <div className="flex items-center justify-between bg-earth-50 border border-sage-200 rounded-md px-4 py-2">
        <span className="text-xs text-charcoal-700 font-medium">{t('method.version')}</span>
        <span className="text-xs text-charcoal-600">BEE CCTS Offset Methodologies</span>
      </div>

      <Disclaimer message={t('method.disclaimer')} variant="info" />

      {/* Auto-matched results */}
      <div>
        <h2 className="font-semibold text-charcoal-900 mb-3">{t('method.screeningResults')} {panchayat.name}</h2>
        <div className="space-y-3">
          {matchResults.map((match) => {
            const config = matchStatusConfig[match.matchStatus];
            const methodName = getMethodName(match.methodologyCode);

            return (
              <div key={match.methodologyCode} className="card">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    {match.methodologyCode !== 'CARBON_OPPORTUNITY_GENERIC' && (
                      <span className="font-bold text-sm text-charcoal-900">{match.methodologyCode}</span>
                    )}
                    <h3 className="font-semibold text-sm text-charcoal-900">{methodName}</h3>
                  </div>
                  <span className={`status-badge border text-xs ${config.color}`}>{t(config.labelKey)}</span>
                </div>

                {/* Why it matches */}
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">{t('method.whyMatches')}</h4>
                  <ul className="space-y-1">
                    {match.matchedCriteria.map((c, i) => (
                      <li key={i} className="text-xs text-forest-700 flex items-start gap-1.5">
                        <CheckCircle size={12} className="mt-0.5 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing info */}
                <div>
                  <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">{t('method.missing')}</h4>
                  <ul className="space-y-1">
                    {match.missingInformation.map((m, i) => (
                      <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                        <AlertCircle size={12} className="mt-0.5 shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 text-xs text-charcoal-500 flex items-center gap-2">
                  <span>{t('method.confidence')} <strong className={`uppercase ${match.confidence === 'high' ? 'text-forest-600' : match.confidence === 'medium' ? 'text-amber-600' : 'text-red-500'}`}>{match.confidence}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full methodology database */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-charcoal-900">{t('method.completeDB')}</h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1"
          >
            {showAll ? t('method.showMatched') : t('method.showAll')}
          </button>
        </div>

        <div className="space-y-3">
          {(showAll ? cctsMethodologies : cctsMethodologies.filter(m => matchedCodes.has(m.methodologyCode))).map((method) => {
            const isMatched = matchedCodes.has(method.methodologyCode);
            return (
              <div key={method.methodologyCode} className={`card card-hover ${isMatched ? 'ring-1 ring-forest-300' : ''}`}>
                <div
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === method.methodologyCode ? null : method.methodologyCode)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-charcoal-900">{method.methodologyCode}</span>
                      <span className="text-xs text-charcoal-500 bg-sage-100 px-1.5 py-0.5 rounded">{method.sector}</span>
                      {isMatched && <span className="text-xs text-forest-600 bg-forest-50 px-1.5 py-0.5 rounded font-semibold">{t('method.matched')}</span>}
                    </div>
                    <h3 className="font-semibold text-sm text-charcoal-900">
                      {lang === 'hi' ? method.nameHi : lang === 'gu' ? method.nameGu : method.name}
                    </h3>
                    <p className="text-xs text-charcoal-600 mt-1">{method.notes}</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-charcoal-500 shrink-0 transition-transform ${expandedId === method.methodologyCode ? 'rotate-180' : ''}`}
                  />
                </div>

                {expandedId === method.methodologyCode && (
                  <div className="mt-4 pt-4 border-t border-sage-200 animate-fade-in space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">{t('method.requiredInputs')}</h4>
                      <div className="flex flex-wrap gap-1">
                        {method.requiredInputs.map((input, i) => (
                          <span key={i} className="bg-earth-100 text-charcoal-700 px-2 py-0.5 rounded text-xs">{input}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">{t('method.screeningQ')}</h4>
                      <ul className="space-y-1">
                        {method.screeningQuestions.map((q, i) => (
                          <li key={i} className="text-xs text-charcoal-700 flex items-start gap-1.5">
                            <HelpCircle size={12} className="mt-0.5 shrink-0 text-charcoal-500" />
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">{t('method.eligibleActivities')}</h4>
                      <div className="flex flex-wrap gap-1">
                        {method.eligibleActivities.map((a, i) => (
                          <span key={i} className="bg-forest-50 text-forest-800 px-2 py-0.5 rounded text-xs">{a}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-charcoal-500">
                      <span>{t('method.updated')} {method.lastUpdated}</span>
                      <span>•</span>
                      <span>{method.officialReference}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-earth-50 rounded-md p-4 border border-sage-200">
        <p className="text-xs text-charcoal-700 leading-relaxed">
          <strong>{t('method.important')}</strong> {t('method.importantText')}
        </p>
      </div>

      <div className="flex justify-between">
        <button onClick={() => navigate('/baseline')} className="btn-secondary">
          ← {t('common.back')}
        </button>
        <button onClick={() => navigate('/viability')} className="btn-primary flex items-center gap-2">
          {t('common.next')}: {t('nav.viability')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
