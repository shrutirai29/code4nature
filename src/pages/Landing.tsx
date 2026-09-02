import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, TreePine, FileCheck, Calculator, Users, ChevronRight, Shield, ArrowDown } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { regulatorySnapshot } from '../data/regulatorySnapshot';

const steps = [
  { num: '01', titleKey: 'landing.step1', icon: TreePine, descKey: 'landing.step1Desc' },
  { num: '02', titleKey: 'landing.step2', icon: FileCheck, descKey: 'landing.step2Desc' },
  { num: '03', titleKey: 'landing.step3', icon: Calculator, descKey: 'landing.step3Desc' },
  { num: '04', titleKey: 'landing.step4', icon: Users, descKey: 'landing.step4Desc' },
];

const chainKeys = ['landing.chainOpenData', 'landing.chainPotential', 'landing.chainMatch', 'landing.chainCosts', 'landing.chainRevenue', 'landing.chainAggregation', 'landing.chainDecision'];

const cycleKeys = [
  { step: 1, titleKey: 'cycle.step1', current: false },
  { step: 2, titleKey: 'cycle.step2', current: true },
  { step: 3, titleKey: 'cycle.step3', current: false },
  { step: 4, titleKey: 'cycle.step4', current: false },
  { step: 5, titleKey: 'cycle.step5', current: false },
  { step: 6, titleKey: 'cycle.step6', current: false },
  { step: 7, titleKey: 'cycle.step7', current: false },
  { step: 8, titleKey: 'cycle.step8', current: false },
  { step: 9, titleKey: 'cycle.step9', current: false },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { loadDemo } = useApp();

  const handleDemo = () => {
    loadDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-sage-200 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Leaf size={22} className="text-forest-700" />
            <span className="font-bold text-forest-800 tracking-wide">VASUDHA CO2</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-charcoal-600 hidden sm:inline">{t('footer.challenge')}</span>
            <button
              onClick={() => navigate('/select')}
              className="btn-primary text-sm"
            >
              {t('landing.cta')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-forest-600" />
              <span className="text-xs font-semibold text-forest-700 uppercase tracking-widest">{t('footer.challenge')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-charcoal-900 mb-2 leading-tight">
              {t('landing.title')}
            </h1>
            <p className="text-lg md:text-xl text-forest-700 font-semibold mb-4">
              {t('landing.subtitle')}
            </p>
            <p className="text-base text-charcoal-700 leading-relaxed mb-8 max-w-2xl">
              {t('landing.description')}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/select')} className="btn-primary flex items-center gap-2 text-base">
                {t('landing.cta')} <ArrowRight size={18} />
              </button>
              <button onClick={handleDemo} className="btn-secondary flex items-center gap-2 text-base">
                {t('landing.ctaDemo')} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiator chain */}
      <section className="py-12 px-6 bg-forest-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-lg md:text-xl font-bold mb-6">{t('landing.differentiator')}</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm">
            {chainKeys.map((key, i) => (
              <div key={key} className="flex items-center gap-2">
                <span className="bg-forest-600/80 px-3 py-1.5 rounded text-xs font-semibold">{t(key)}</span>
                {i < chainKeys.length - 1 && <ArrowRight size={14} className="text-forest-300 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-2">{t('landing.howItWorksTitle')}</h2>
          <p className="text-charcoal-600 mb-10">{t('landing.howItWorksSub')}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="card card-hover animate-slide-up">
                <div className="text-3xl font-extrabold text-forest-200 mb-3">{step.num}</div>
                <div className="flex items-center gap-2 mb-2">
                  <step.icon size={18} className="text-forest-600" />
                  <h3 className="font-semibold text-charcoal-900 text-sm">{t(step.titleKey)}</h3>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Cycle */}
      <section className="py-16 px-6 bg-earth-50 border-y border-sage-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-2 text-center">{t('cycle.title')}</h2>
          <p className="text-charcoal-600 mb-8 text-center text-sm">{t('cycle.sub')}</p>
          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-0">
            {cycleKeys.map((item, i) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex flex-col items-center px-2 md:px-4 py-3 rounded-lg transition-all ${
                  item.current
                    ? 'bg-forest-700 text-white scale-110 shadow-lg'
                    : item.step < 2
                    ? 'bg-sage-100 text-charcoal-500'
                    : 'bg-white border border-sage-200 text-charcoal-700'
                }`}>
                  <span className={`text-lg font-bold ${item.current ? 'text-white' : 'text-charcoal-900'}`}>{item.step}</span>
                  <span className={`text-xs text-center max-w-16 leading-tight ${item.current ? 'text-forest-100 font-semibold' : ''}`}>{t(item.titleKey)}</span>
                  {item.current && (
                    <span className="text-xs font-bold text-amber-300 mt-1 uppercase tracking-wider">{t('cycle.youAreHere')}</span>
                  )}
                </div>
                {i < cycleKeys.length - 1 && (
                  <ArrowRight size={14} className="text-charcoal-400 mx-0.5 hidden md:block" />
                )}
                {i < cycleKeys.length - 1 && (
                  <ArrowDown size={14} className="text-charcoal-400 my-1 md:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Hierarchy */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-charcoal-900 mb-6 text-center">{t('reg.title')}</h2>
          <div className="card">
            <div className="space-y-3">
              {[
                { label: t('reg.legalBasis'), value: regulatorySnapshot.legalBasis, indent: 0 },
                { label: t('reg.scheme'), value: regulatorySnapshot.schemeName, indent: 1 },
                { label: t('reg.market'), value: regulatorySnapshot.frameworkName, indent: 2 },
                { label: t('reg.mechanism'), value: t('reg.mechanismValue'), indent: 2 },
                { label: t('reg.vasudhaRole'), value: t('reg.vasudhaRoleValue'), indent: 3, highlight: true },
              ].map((item) => (
                <div key={item.label} className={`flex items-start gap-3 ${item.indent > 0 ? `ml-${item.indent * 6}` : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.highlight ? 'bg-forest-600' : 'bg-charcoal-400'}`} />
                  <div>
                    <span className="text-xs text-charcoal-600 uppercase tracking-wider">{item.label}</span>
                    <p className={`text-sm ${item.highlight ? 'text-forest-700 font-semibold' : 'text-charcoal-900'}`}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md p-3">
            <Shield size={14} className="text-amber-700 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">{t('reg.warning')}</p>
          </div>
        </div>
      </section>

      {/* Trust statement */}
      <section className="py-12 px-6 bg-earth-50 border-y border-sage-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm text-charcoal-700 font-medium">{t('landing.trust')}</p>
            <p className="text-xs text-charcoal-600 mt-1">{t('footer.theme')}</p>
          </div>
          <button onClick={handleDemo} className="btn-primary flex items-center gap-2">
            {t('common.tryDemo')} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Product philosophy */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-charcoal-900 mb-4">{t('landing.philosophyTitle')}</h2>
          <p className="text-lg text-forest-700 font-semibold mb-2">"{t('landing.philosophy')}"</p>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            {t('landing.philosophyText')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-charcoal-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-forest-400" />
            <span className="font-bold text-sm">VASUDHA CO2</span>
          </div>
          <p className="text-xs text-sage-400">
            {t('footer.challenge')} — {t('footer.theme')}
          </p>
          <p className="text-xs text-sage-500">
            {t('landing.trust')}
          </p>
        </div>
      </footer>
    </div>
  );
}
