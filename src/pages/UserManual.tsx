import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ChevronDown, ChevronRight, ArrowRight,
  LayoutDashboard, Layers, FlaskConical, Calculator,
  Users, ClipboardCheck, FileText, Leaf, AlertTriangle,
  HelpCircle, Shield, TrendingUp, IndianRupee,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';

interface GuideSection {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  contentKey: string;
  steps?: { titleKey: string; descKey: string; icon?: React.ReactNode }[];
}

const guideSections: GuideSection[] = [
  {
    id: 'quickstart',
    icon: <Leaf size={18} />,
    titleKey: 'manual.quickstart',
    contentKey: 'manual.quickstartDesc',
  },
  {
    id: 'step1',
    icon: <LayoutDashboard size={18} />,
    titleKey: 'manual.step1Title',
    contentKey: 'manual.step1Desc',
    steps: [
      { titleKey: 'manual.step1a', descKey: 'manual.step1aDesc', icon: <LayoutDashboard size={14} /> },
      { titleKey: 'manual.step1b', descKey: 'manual.step1bDesc', icon: <TrendingUp size={14} /> },
      { titleKey: 'manual.step1c', descKey: 'manual.step1cDesc', icon: <Shield size={14} /> },
    ],
  },
  {
    id: 'step2',
    icon: <Layers size={18} />,
    titleKey: 'manual.step2Title',
    contentKey: 'manual.step2Desc',
    steps: [
      { titleKey: 'manual.step2a', descKey: 'manual.step2aDesc' },
      { titleKey: 'manual.step2b', descKey: 'manual.step2bDesc' },
      { titleKey: 'manual.step2c', descKey: 'manual.step2cDesc' },
    ],
  },
  {
    id: 'step3',
    icon: <FlaskConical size={18} />,
    titleKey: 'manual.step3Title',
    contentKey: 'manual.step3Desc',
    steps: [
      { titleKey: 'manual.step3a', descKey: 'manual.step3aDesc' },
      { titleKey: 'manual.step3b', descKey: 'manual.step3bDesc' },
      { titleKey: 'manual.step3c', descKey: 'manual.step3cDesc' },
    ],
  },
  {
    id: 'step4',
    icon: <Calculator size={18} />,
    titleKey: 'manual.step4Title',
    contentKey: 'manual.step4Desc',
    steps: [
      { titleKey: 'manual.step4a', descKey: 'manual.step4aDesc' },
      { titleKey: 'manual.step4b', descKey: 'manual.step4bDesc' },
      { titleKey: 'manual.step4c', descKey: 'manual.step4cDesc' },
      { titleKey: 'manual.step4d', descKey: 'manual.step4dDesc' },
    ],
  },
  {
    id: 'step5',
    icon: <Users size={18} />,
    titleKey: 'manual.step5Title',
    contentKey: 'manual.step5Desc',
  },
  {
    id: 'step6',
    icon: <ClipboardCheck size={18} />,
    titleKey: 'manual.step6Title',
    contentKey: 'manual.step6Desc',
  },
  {
    id: 'step7',
    icon: <FileText size={18} />,
    titleKey: 'manual.step7Title',
    contentKey: 'manual.step7Desc',
    steps: [
      { titleKey: 'manual.step7a', descKey: 'manual.step7aDesc' },
      { titleKey: 'manual.step7b', descKey: 'manual.step7bDesc' },
      { titleKey: 'manual.step7c', descKey: 'manual.step7cDesc' },
    ],
  },
  {
    id: 'numbers',
    icon: <HelpCircle size={18} />,
    titleKey: 'manual.numbersTitle',
    contentKey: 'manual.numbersDesc',
    steps: [
      { titleKey: 'manual.num1', descKey: 'manual.num1Desc' },
      { titleKey: 'manual.num2', descKey: 'manual.num2Desc' },
      { titleKey: 'manual.num3', descKey: 'manual.num3Desc' },
      { titleKey: 'manual.num4', descKey: 'manual.num4Desc' },
      { titleKey: 'manual.num5', descKey: 'manual.num5Desc' },
    ],
  },
  {
    id: 'tips',
    icon: <AlertTriangle size={18} />,
    titleKey: 'manual.tipsTitle',
    contentKey: 'manual.tipsDesc',
    steps: [
      { titleKey: 'manual.tip1', descKey: 'manual.tip1Desc' },
      { titleKey: 'manual.tip2', descKey: 'manual.tip2Desc' },
      { titleKey: 'manual.tip3', descKey: 'manual.tip3Desc' },
      { titleKey: 'manual.tip4', descKey: 'manual.tip4Desc' },
    ],
  },
];

const pageGuide = [
  { path: '/dashboard', icon: LayoutDashboard, titleKey: 'manual.pgDash', descKey: 'manual.pgDashDesc' },
  { path: '/baseline', icon: Layers, titleKey: 'manual.pgBase', descKey: 'manual.pgBaseDesc' },
  { path: '/methodology', icon: FlaskConical, titleKey: 'manual.pgMeth', descKey: 'manual.pgMethDesc' },
  { path: '/viability', icon: Calculator, titleKey: 'manual.pgViab', descKey: 'manual.pgViabDesc' },
  { path: '/aggregation', icon: Users, titleKey: 'manual.pgAgg', descKey: 'manual.pgAggDesc' },
  { path: '/readiness', icon: ClipboardCheck, titleKey: 'manual.pgReady', descKey: 'manual.pgReadyDesc' },
  { path: '/decision', icon: FileText, titleKey: 'manual.pgDec', descKey: 'manual.pgDecDesc' },
  { path: '/data-sources', icon: null, titleKey: 'manual.pgData', descKey: 'manual.pgDataDesc' },
  { path: '/about', icon: null, titleKey: 'manual.pgAbout', descKey: 'manual.pgAboutDesc' },
];

export default function UserManual() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [expandedSection, setExpandedSection] = useState<string | null>('quickstart');

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-charcoal-900 flex items-center gap-2">
          <BookOpen size={20} className="text-forest-700" />
          {t('manual.title')}
        </h1>
        <p className="text-sm text-charcoal-600 mt-1">{t('manual.subtitle')}</p>
      </div>

      {/* Quick reference card */}
      <div className="card bg-forest-50 border-forest-200 p-5">
        <h2 className="font-semibold text-sm text-charcoal-900 mb-3 flex items-center gap-2">
          <Leaf size={16} className="text-forest-600" />
          {t('manual.quickRef')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-semibold text-charcoal-700">{t('manual.whoFor')}</span>
            <p className="text-charcoal-600 mt-1">{t('manual.whoForAns')}</p>
          </div>
          <div>
            <span className="font-semibold text-charcoal-700">{t('manual.whatDoes')}</span>
            <p className="text-charcoal-600 mt-1">{t('manual.whatDoesAns')}</p>
          </div>
          <div>
            <span className="font-semibold text-charcoal-700">{t('manual.importantNote')}</span>
            <p className="text-charcoal-600 mt-1">{t('manual.importantNoteAns')}</p>
          </div>
        </div>
      </div>

      {/* Step-by-step guide */}
      <div>
        <h2 className="font-semibold text-charcoal-900 mb-3">{t('manual.guideTitle')}</h2>
        <div className="space-y-2">
          {guideSections.map((section) => {
            const isExpanded = expandedSection === section.id;
            return (
              <div key={section.id} className="card">
                <button
                  className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center shrink-0 text-forest-700">
                    {section.icon}
                  </div>
                  <span className="font-semibold text-sm text-charcoal-900 flex-1">{t(section.titleKey)}</span>
                  <ChevronDown
                    size={16}
                    className={`text-charcoal-500 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className="text-sm text-charcoal-700 leading-relaxed mb-3">{t(section.contentKey)}</p>

                    {section.steps && (
                      <div className="space-y-2 ml-2">
                        {section.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-earth-50 border border-sage-100">
                            <div className="w-6 h-6 rounded-full bg-forest-100 flex items-center justify-center shrink-0 text-forest-700 text-xs font-bold mt-0.5">
                              {step.icon || (i + 1)}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-charcoal-900">{t(step.titleKey)}</span>
                              <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed">{t(step.descKey)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Page-by-page guide */}
      <div>
        <h2 className="font-semibold text-charcoal-900 mb-3">{t('manual.pagesTitle')}</h2>
        <p className="text-sm text-charcoal-600 mb-4">{t('manual.pagesDesc')}</p>
        <div className="space-y-2">
          {pageGuide.map((page, i) => (
            <button
              key={page.path}
              onClick={() => navigate(page.path)}
              className="w-full card card-hover text-left flex items-start gap-3 p-4"
            >
              <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center shrink-0 text-forest-700 text-xs font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-charcoal-900">{t(page.titleKey)}</span>
                  <ArrowRight size={12} className="text-charcoal-400" />
                </div>
                <p className="text-xs text-charcoal-600 mt-0.5">{t(page.descKey)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Glossary */}
      <div className="card">
        <h2 className="font-semibold text-charcoal-900 mb-3 flex items-center gap-2">
          <HelpCircle size={16} className="text-forest-600" />
          {t('manual.glossaryTitle')}
        </h2>
        <div className="space-y-2">
          {[
            { term: 'CCTS', def: 'manual.glossCCTS' },
            { term: 'CCC', def: 'manual.glossCCC' },
            { term: 'tCO₂e', def: 'manual.glossCO2e' },
            { term: 'ACVA', def: 'manual.glossACVA' },
            { term: 'BEE', def: 'manual.glossBEE' },
            { term: 'MRV', def: 'manual.glossMRV' },
            { term: 'PDD', def: 'manual.glossPDD' },
            { term: 'Gram Sabha', def: 'manual.glossGS' },
            { term: 'Aggregator', def: 'manual.glossAgg' },
            { term: 'Additionality', def: 'manual.glossAdd' },
          ].map((item) => (
            <div key={item.term} className="flex items-start gap-3 p-2 rounded-md bg-earth-50/50">
              <span className="font-semibold text-sm text-forest-700 w-32 shrink-0">{item.term}</span>
              <span className="text-xs text-charcoal-700">{t(item.def)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help box */}
      <div className="card bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-700 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-amber-800 mb-1">{t('manual.helpTitle')}</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">{t('manual.helpText')}</p>
          </div>
        </div>
      </div>

      {/* Back to dashboard */}
      <div className="flex justify-end">
        <button onClick={() => navigate('/dashboard')} className="btn-primary flex items-center gap-2">
          {t('nav.overview')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
