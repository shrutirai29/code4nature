import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Play, ArrowRight, Leaf } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { allStates } from '../data/locations';

export default function PanchayatSelection() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { setPanchayat, loadDemo } = useApp();

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [search, setSearch] = useState('');

  const states = useMemo(() => Object.keys(allStates).sort(), []);
  const districts = useMemo(
    () => (selectedState ? Object.keys(allStates[selectedState] ?? {}).sort() : []),
    [selectedState],
  );
  const blocks = useMemo(
    () => (selectedDistrict && selectedState ? Object.keys(allStates[selectedState]?.[selectedDistrict] ?? {}).sort() : []),
    [selectedState, selectedDistrict],
  );
  const panchayats = useMemo(
    () => (selectedBlock && selectedState && selectedDistrict ? (allStates[selectedState]?.[selectedDistrict]?.[selectedBlock] ?? []) : []),
    [selectedState, selectedDistrict, selectedBlock],
  );

  const handleAnalyze = () => {
    loadDemo();
    navigate('/dashboard');
  };

  const handleDemo = () => {
    loadDemo();
    navigate('/dashboard');
  };

  const handleReset = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedBlock('');
    setSelectedPanchayat('');
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-sage-200">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => navigate('/')} className="text-charcoal-600 hover:text-charcoal-900 text-sm">
              ← Back to Home
            </button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Leaf size={24} className="text-forest-700" />
            <span className="font-bold text-forest-800">VASUDHA CO2</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900">{t('select.title')}</h1>
          <p className="text-sm text-charcoal-600 mt-2">
            Select your Panchayat to see an analysis of carbon-credit project viability.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('select.search')}
            className="w-full pl-9 pr-4 py-2.5 border border-sage-200 rounded-md text-sm focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">{t('select.state')}</label>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); setSelectedBlock(''); setSelectedPanchayat(''); }}
              className="w-full px-3 py-2.5 border border-sage-200 rounded-md text-sm bg-white focus:outline-none focus:border-forest-500"
            >
              <option value="">Select state...</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">{t('select.district')}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedBlock(''); setSelectedPanchayat(''); }}
              disabled={!selectedState}
              className="w-full px-3 py-2.5 border border-sage-200 rounded-md text-sm bg-white disabled:opacity-50 focus:outline-none focus:border-forest-500"
            >
              <option value="">Select district...</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">{t('select.block')}</label>
            <select
              value={selectedBlock}
              onChange={(e) => { setSelectedBlock(e.target.value); setSelectedPanchayat(''); }}
              disabled={!selectedDistrict}
              className="w-full px-3 py-2.5 border border-sage-200 rounded-md text-sm bg-white disabled:opacity-50 focus:outline-none focus:border-forest-500"
            >
              <option value="">Select block / taluka...</option>
              {blocks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">{t('select.panchayat')}</label>
            <select
              value={selectedPanchayat}
              onChange={(e) => setSelectedPanchayat(e.target.value)}
              disabled={!selectedBlock}
              className="w-full px-3 py-2.5 border border-sage-200 rounded-md text-sm bg-white disabled:opacity-50 focus:outline-none focus:border-forest-500"
            >
              <option value="">Select Gram Panchayat...</option>
              {panchayats.map((p: string) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={handleAnalyze}
            disabled={!selectedPanchayat}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('select.analyze')} <ArrowRight size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-sage-200" />
          <span className="text-xs text-charcoal-600">OR</span>
          <div className="flex-1 h-px bg-sage-200" />
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={handleDemo}
            className="card card-hover text-left flex items-start gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center shrink-0">
              <Play size={18} className="text-forest-700 ml-0.5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-charcoal-900">{t('landing.ctaDemo')}</div>
              <div className="text-xs text-charcoal-600 mt-1">
                Explore the full analysis with a realistic demo Panchayat.
              </div>
            </div>
          </button>

          <button
            onClick={() => {}}
            className="card card-hover text-left flex items-start gap-3 cursor-pointer opacity-60"
          >
            <div className="w-10 h-10 rounded-lg bg-earth-100 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-earth-600" />
            </div>
            <div>
              <div className="font-semibold text-sm text-charcoal-900">{t('select.location')}</div>
              <div className="text-xs text-charcoal-600 mt-1">
                Use your device location (requires permission).
              </div>
            </div>
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-charcoal-600 leading-relaxed">
          Demo data is based on realistic Indian Panchayat parameters. In production, data would come from
          MGNREGA, eGramSwaraj, satellite imagery, and other open data sources.
        </p>
      </div>
    </div>
  );
}
