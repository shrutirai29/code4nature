import { useNavigate } from 'react-router-dom';
import { Info, AlertTriangle, Leaf, Heart, Shield, BookOpen, ArrowRight } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { regulatorySnapshot } from '../data/regulatorySnapshot';

export default function About() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900 flex items-center gap-2">
          <Info size={20} className="text-forest-700" />
          {t('about.title')}
        </h1>
      </div>

      {/* Quick Start Link */}
      <button
        onClick={() => navigate('/manual')}
        className="w-full card card-hover bg-forest-50 border-forest-200 flex items-center gap-4 p-5 text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
          <BookOpen size={24} className="text-forest-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-charcoal-900">{t('nav.manual')}</h3>
          <p className="text-xs text-charcoal-600 mt-0.5">{t('manual.subtitle')}</p>
        </div>
        <ArrowRight size={18} className="text-forest-600 shrink-0" />
      </button>

      {/* Mission */}
      <div className="card">
        <h2 className="font-semibold text-charcoal-900 mb-2">{t('about.whatIs')}</h2>
        <p className="text-sm text-charcoal-700 leading-relaxed">{t('about.whatIsText1')}</p>
        <p className="text-sm text-charcoal-700 leading-relaxed mt-3">
          {t('about.whatIsText2')}
        </p>
      </div>

      {/* Regulatory Hierarchy */}
      <div className="card">
        <h2 className="font-semibold text-charcoal-900 mb-3 flex items-center gap-2">
          <Shield size={16} className="text-forest-600" />
          {t('reg.title')}
        </h2>
        <div className="space-y-2 text-sm text-charcoal-700">
          {[
            { label: t('reg.legalBasis'), value: regulatorySnapshot.legalBasis, indent: 0 },
            { label: t('reg.scheme'), value: regulatorySnapshot.schemeName, indent: 1 },
            { label: t('reg.market'), value: regulatorySnapshot.frameworkName, indent: 2 },
            { label: 'Compliance Mechanism', value: 'For obligated entities (power sector, industry)', indent: 2 },
            { label: 'Offset Mechanism', value: 'For voluntary projects by non-obligated entities', indent: 2 },
            { label: 'Project Registration', value: 'Through BEE under applicable methodology', indent: 3 },
            { label: 'Validation / Verification', value: 'Through ACVA-accredited agencies', indent: 3 },
            { label: 'CCC Issuance', value: '1 CCC = 1 tCO₂e reduction/removal', indent: 3 },
            { label: 'Trading', value: 'On authorized power exchanges / bilateral', indent: 3 },
            { label: '', value: '', indent: 0 },
            { label: t('reg.vasudhaRole'), value: t('reg.vasudhaRoleValue'), indent: 0, highlight: true },
          ].map((item) => item.label ? (
            <div key={item.label + item.value} className={`flex items-start gap-2 ${item.indent > 0 ? `ml-${item.indent * 4}` : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${item.highlight ? 'bg-forest-600' : 'bg-charcoal-400'}`} />
              <div>
                <span className="text-xs text-charcoal-600 uppercase tracking-wider">{item.label}</span>
                <p className={`text-sm ${item.highlight ? 'text-forest-700 font-semibold' : 'text-charcoal-800'}`}>{item.value}</p>
              </div>
            </div>
          ) : null)}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card border-amber-300 bg-amber-50/50">
        <h2 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} />
          {t('about.disclaimer')}
        </h2>
        <div className="space-y-3 text-sm text-charcoal-700 leading-relaxed">
          <p><strong>{t('about.discScreening')}</strong> {t('about.discScreeningText')}</p>
          <p><strong>{t('about.discNotVerif')}</strong> {t('about.discNotVerifText')}</p>
          <p><strong>{t('about.discNotReg')}</strong> {t('about.discNotRegText')}</p>
          <p><strong>{t('about.discMethodScreen')}</strong> {t('about.discMethodScreenText')}</p>
          <p><strong>{t('about.discFinancial')}</strong> {t('about.discFinancialText')}</p>
          <p><strong>{t('about.discRules')}</strong> {t('about.discRulesText')}</p>
          <p><strong>{t('about.discAdvice')}</strong> {t('about.discAdviceText')}</p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="card">
        <h2 className="font-semibold text-charcoal-900 mb-2">{t('about.philosophy')}</h2>
        <div className="text-center py-4">
          <p className="text-lg text-forest-700 font-semibold italic">
            {t('about.philosophyQuote')}
          </p>
        </div>
        <p className="text-sm text-charcoal-700 leading-relaxed">{t('about.philosophyText1')}</p>
        <p className="text-sm text-charcoal-700 leading-relaxed mt-3">{t('about.philosophyText2')}</p>
      </div>

      {/* Tech */}
      <div className="card">
        <h2 className="font-semibold text-charcoal-900 mb-2">{t('about.technology')}</h2>
        <p className="text-sm text-charcoal-700 leading-relaxed">{t('about.techText1')}</p>
        <p className="text-sm text-charcoal-700 leading-relaxed mt-3">{t('about.techText2')}</p>
      </div>

      {/* Acknowledgments */}
      <div className="card">
        <h2 className="font-semibold text-charcoal-900 mb-2 flex items-center gap-2">
          <Heart size={16} className="text-red-400" />
          {t('about.acknowledgments')}
        </h2>
        <p className="text-sm text-charcoal-700 leading-relaxed">{t('about.ackText')}</p>
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Leaf size={20} className="text-forest-700" />
          <span className="font-bold text-forest-800">VASUDHA CO2</span>
        </div>
        <p className="text-xs text-charcoal-600">{t('footer.challenge')}</p>
        <p className="text-xs text-charcoal-600">{t('footer.theme')}</p>
      </div>

      <div className="flex justify-start pb-8">
        <button onClick={() => navigate('/data-sources')} className="btn-secondary">
          ← {t('common.back')} {t('nav.data')}
        </button>
      </div>
    </div>
  );
}
