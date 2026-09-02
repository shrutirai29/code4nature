import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, Printer, Share2, CheckCircle,
  AlertTriangle, Leaf, ArrowRight, ArrowLeft, Shield, HelpCircle,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { contractQuestions } from '../data/demo';
import { calculateViability, calculateDecisionScore, calculateContractTransparency, formatRange, formatCurrency } from '../utils/calculations';
import { matchMethodologies } from '../data/cctsMethodologies';
import { regulatorySnapshot } from '../data/regulatorySnapshot';
import Disclaimer from '../components/shared/Disclaimer';

export default function DecisionPack() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { panchayat, viabilityInputs, loadDemo, contractAnswers, toggleContractAnswer } = useApp();
  const [showContract, setShowContract] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => { if (!panchayat) loadDemo(); }, [panchayat, loadDemo]);

  const methodologyMatches = useMemo(() => panchayat ? matchMethodologies(panchayat) : [], [panchayat]);
  const positiveMatches = methodologyMatches.filter(m => m.matchStatus === 'potential_match');

  const viability = useMemo(() => panchayat ? calculateViability(panchayat, viabilityInputs) : null, [panchayat, viabilityInputs]);
  const score = useMemo(() => panchayat && viability ? calculateDecisionScore(panchayat, viability, positiveMatches.length) : null, [panchayat, viability, positiveMatches]);
  const contractScore = useMemo(() => calculateContractTransparency(contractQuestions, contractAnswers), [contractAnswers]);

  if (!panchayat || !viability || !score) return null;

  const overallLabel = {
    viable: t('dash.viable'),
    conditionally_viable: t('dash.viable'),
    marginal: t('dash.marginal'),
    not_viable: t('dash.notViable'),
  }[score.overall];

  const handlePrint = () => window.print();
  const handleDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  const askQuestions = [
    t('decision.askQ1'), t('decision.askQ2'), t('decision.askQ3'), t('decision.askQ4'),
    t('decision.askQ5'), t('decision.askQ6'), t('decision.askQ7'), t('decision.askQ8'),
  ];

  const riskItems = [
    `${t('decision.risk1')} (${viabilityInputs.projectDuration} ${t('decision.risk1b')})`,
    t('decision.risk2'),
    t('decision.risk3'),
    t('decision.risk4'),
    t('decision.risk5'),
    t('decision.risk6'),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Brief Section */}
      <div className="card p-0 overflow-hidden" id="decision-brief">
        <div className="bg-forest-800 text-white px-6 py-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={18} />
            <h1 className="font-bold">{t('decision.title')}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-forest-200">
            <span>{t('decision.panchayat')} <strong className="text-white">{panchayat.name}</strong></span>
            <span>{t('decision.date')} <strong className="text-white">31 August 2026</strong></span>
          </div>
        </div>

        <div className="p-6">
          {/* Decision verdict */}
          <div className="text-center mb-6">
            <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-2">{t('decision.decisionLabel')}</div>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-lg font-bold border
              text-amber-700 bg-amber-50 border-amber-300">
              {overallLabel}
            </span>
          </div>

          {/* CCTS Status Section */}
          <div className="bg-earth-50 border border-sage-200 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-sm text-charcoal-900 mb-3 flex items-center gap-2">
              <Shield size={14} className="text-forest-600" />
              {t('decision.cctsStatus')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="text-xs">
                <span className="text-charcoal-600">{t('decision.potentialMethod')}</span>
                <span className="font-bold text-charcoal-900 ml-1">
                  {positiveMatches.length > 0 ? positiveMatches[0].methodologyCode : t('decision.noDirectMatch')}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-charcoal-600">{t('decision.statusLabel')}</span>
                <span className="font-bold text-forest-700 ml-1">{t('decision.potentialMatch')}</span>
              </div>
              <div className="text-xs">
                <span className="text-charcoal-600">{t('decision.formalElig')}</span>
                <span className="font-bold text-amber-700 ml-1">{t('decision.notEstablished')}</span>
              </div>
              <div className="text-xs">
                <span className="text-charcoal-600">{t('decision.verifRequired')}</span>
                <span className="font-bold text-charcoal-900 ml-1">{t('decision.yesACVA')}</span>
              </div>
              <div className="text-xs">
                <span className="text-charcoal-600">{t('decision.methodDB')}</span>
                <span className="font-bold text-charcoal-900 ml-1">{regulatorySnapshot.methodologyLastUpdated}</span>
              </div>
              <div className="text-xs">
                <span className="text-charcoal-600">{t('decision.framework')}</span>
                <span className="font-bold text-charcoal-900 ml-1">{regulatorySnapshot.legalBasis}</span>
              </div>
            </div>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: t('decision.mitPotential'), value: `${formatRange(viability.estimatedMitigationPotential)} tCO₂e/year` },
              { label: t('decision.potCCCs'), value: `${formatRange(viability.potentialIssuableCCCs)}/year` },
              { label: t('decision.netRevenue'), value: `${formatRange(viability.netRevenue)}/year` },
              { label: t('decision.hhBenefit'), value: `${formatRange(viability.netPerHousehold)}/year` },
              { label: t('decision.projDuration'), value: `${viabilityInputs.projectDuration} years` },
              { label: t('decision.methodMatches'), value: `${positiveMatches.length} ${t('decision.potential')}` },
            ].map((item) => (
              <div key={item.label} className="bg-earth-50 border border-sage-200 rounded-md p-3">
                <div className="text-xs text-charcoal-600 uppercase tracking-wider">{item.label}</div>
                <div className="text-sm font-bold text-charcoal-900 mt-1">{item.value}</div>
              </div>
            ))}
          </div>

          {/* What the Panchayat should ask */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-charcoal-900 mb-3 flex items-center gap-2">
              <HelpCircle size={14} className="text-forest-600" />
              {t('decision.whatToAsk')}
            </h3>
            <div className="space-y-1.5">
              {askQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-charcoal-700">
                  <span className="font-bold text-charcoal-900 mt-0.5">{i + 1}.</span>
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-charcoal-900 mb-2">{t('decision.risks')}</h3>
            <ul className="text-sm text-charcoal-700 space-y-1.5 list-disc list-inside">
              {riskItems.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>

          {/* Recommendation */}
          <div className="bg-forest-50 border border-forest-200 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-sm text-charcoal-900 mb-2">{t('decision.recommendation')}</h3>
            <p className="text-sm text-charcoal-700 leading-relaxed">{t('decision.recText')}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 no-print">
            <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
              <Download size={14} />
              {downloadStarted ? 'Downloaded!' : t('decision.download')}
            </button>
            <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
              <Printer size={14} />
              {t('decision.print')}
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Share2 size={14} />
              {t('decision.share')}
            </button>
          </div>
        </div>
      </div>

      {/* Contract Transparency Scanner */}
      <div className="card">
        <h2 className="font-bold text-lg text-charcoal-900 mb-1 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          {t('contract.title')}
        </h2>
        <p className="text-sm text-charcoal-600 mb-4">{t('contract.subtitle')}</p>

        <Disclaimer message={t('contract.warning')} />

        {/* Contract Transparency Score */}
        <div className="bg-earth-50 border border-sage-200 rounded-md p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-charcoal-900">{t('contract.score')}</span>
            <span className="text-lg font-bold text-charcoal-900">
              {contractScore.score} / {contractScore.maxScore}
            </span>
          </div>
          <div className="h-2.5 bg-sage-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                contractScore.score / contractScore.maxScore >= 0.7 ? 'bg-forest-500' :
                contractScore.score / contractScore.maxScore >= 0.4 ? 'bg-amber-500' : 'bg-red-400'
              }`}
              style={{ width: `${(contractScore.score / contractScore.maxScore) * 100}%` }}
            />
          </div>
          <p className="text-xs text-charcoal-600 mt-2">
            {contractScore.answeredCount} {t('common.of')} {contractScore.totalQuestions} {t('contract.answered')}
            {contractScore.warnings.length > 0 && (
              <span className="text-amber-700 ml-1">{contractScore.warnings.length} {t('contract.criticalItems')}</span>
            )}
          </p>
        </div>

        {/* Contract questions */}
        <div className="space-y-2 mb-4">
          {contractQuestions.map((q) => {
            const isChecked = contractAnswers.has(q.id);
            return (
              <div
                key={q.id}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all
                  ${isChecked ? 'bg-forest-50 border-forest-200' : 'bg-white border-sage-200 hover:bg-earth-50'}`}
                onClick={() => toggleContractAnswer(q.id)}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5
                  ${isChecked ? 'bg-forest-600 border-forest-600' : 'border-sage-300'}`}>
                  {isChecked && <CheckCircle size={12} className="text-white" />}
                </div>
                <div className="flex-1">
                  <span className={`text-sm ${isChecked ? 'text-forest-700 font-medium' : 'text-charcoal-900'}`}>
                    {lang === 'hi' ? q.questionHi : lang === 'gu' ? q.questionGu : q.question}
                  </span>
                </div>
                {q.weight === 3 && !isChecked && (
                  <span className="text-xs text-amber-600 font-medium whitespace-nowrap">{t('contract.critical')}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Upload */}
        <div className="mt-4 pt-4 border-t border-sage-200">
          <button
            onClick={() => setShowContract(!showContract)}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            {t('contract.upload')}
          </button>
          {showContract && (
            <div className="mt-3 bg-earth-50 border border-sage-200 rounded-md p-4 animate-fade-in">
              <p className="text-sm text-charcoal-700 font-medium mb-2">{t('contract.simDoc')}</p>
              <div className="text-xs text-charcoal-600 space-y-1">
                <p>{t('contract.docName')}</p>
                <p className="text-amber-700">{t('contract.docWarn1')}</p>
                <p className="text-forest-700">{t('contract.docGood1')}</p>
                <p className="text-amber-700">{t('contract.docWarn2')}</p>
                <p className="text-amber-700">{t('contract.docWarn3')}</p>
                <p className="text-forest-700">{t('contract.docGood2')}</p>
                <p className="text-charcoal-600 mt-2 italic">{t('contract.docNote')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Regulatory Snapshot */}
      <div className="card">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-3">{t('data.regFramework')}</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-charcoal-600">{t('data.legalBasis')}</span>
            <span className="font-medium text-charcoal-900 ml-1">{regulatorySnapshot.legalBasis}</span>
          </div>
          <div>
            <span className="text-charcoal-600">{t('data.scheme')}</span>
            <span className="font-medium text-forest-700 ml-1">{regulatorySnapshot.schemeName}</span>
          </div>
          <div>
            <span className="text-charcoal-600">{t('data.methodDB')}</span>
            <span className="font-medium text-charcoal-900 ml-1">{regulatorySnapshot.methodologyLastUpdated}</span>
          </div>
        </div>
        <p className="text-xs text-charcoal-500 mt-2 italic">{regulatorySnapshot.disclaimer}</p>
      </div>

      {/* Footer */}
      <div className="card text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf size={24} className="text-forest-700" />
          <span className="font-bold text-forest-800 text-lg">VASUDHA CO2</span>
        </div>
        <p className="text-charcoal-700 font-medium mb-2">{t('decision.endTitle')}</p>
        <p className="text-xs text-charcoal-600 max-w-lg mx-auto leading-relaxed">{t('decision.endDisclaimer')}</p>
        <div className="mt-6 pt-4 border-t border-sage-200">
          <p className="text-xs text-charcoal-600 font-medium">{t('footer.challenge')}</p>
          <p className="text-xs text-charcoal-600">{t('footer.theme')}</p>
        </div>
      </div>

      <div className="flex justify-between no-print">
        <button onClick={() => navigate('/readiness')} className="btn-secondary">
          <ArrowLeft size={14} className="mr-1" /> {t('common.back')}
        </button>
        <button onClick={() => navigate('/data-sources')} className="btn-primary flex items-center gap-2">
          {t('nav.data')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
