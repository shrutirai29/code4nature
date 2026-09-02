import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Minus, ArrowRight, TrendingUp, MapPin, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useApp } from '../contexts/AppContext';
import { neighbouringPanchayats } from '../data/demo';
import { getCombinedPotential, formatRange } from '../utils/calculations';

export default function Aggregation() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { panchayat, selectedNeighbours, toggleNeighbour, loadDemo } = useApp();

  useEffect(() => { if (!panchayat) loadDemo(); }, [panchayat, loadDemo]);

  if (!panchayat) return null;

  const combined = getCombinedPotential(panchayat, selectedNeighbours);
  const isSelected = (name: string) => selectedNeighbours.some(n => n.name === name);
  const currentMethodologyCodes = panchayat.potentialActivities?.length ? ['BM AG04.001', 'BM AG04.002', 'BM FR05.002'] : ['BM FR05.002'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900 flex items-center gap-2">
          <Users size={20} className="text-forest-700" />
          {t('agg.title')}
        </h1>
        <p className="text-sm text-charcoal-600 mt-1">{t('agg.subtitle')}</p>
      </div>

      {/* Current Panchayat */}
      <div className="card bg-forest-50 border-forest-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-charcoal-600 uppercase tracking-wider mb-1">{t('agg.current')}</div>
            <h3 className="font-bold text-charcoal-900">{panchayat.name}</h3>
            <p className="text-sm text-charcoal-600">{panchayat.block}, {panchayat.district}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-charcoal-600">{t('agg.mitPotential')}</div>
            <div className="text-lg font-bold text-forest-800">
              {formatRange(panchayat.carbonPotential.total)} tCO₂e/yr
            </div>
          </div>
        </div>
      </div>

      {/* Neighbours */}
      <div>
        <h3 className="font-semibold text-sm text-charcoal-900 mb-3">{t('agg.neighbours')}</h3>
        <div className="space-y-3">
          {neighbouringPanchayats.map((neighbour) => {
            const selected = isSelected(neighbour.name);
            const sharedMethodologies = currentMethodologyCodes.filter(m => neighbour.methodologyOverlap.includes(m));
            const isCompatible = sharedMethodologies.length > 0;

            return (
              <div
                key={neighbour.name}
                className={`card card-hover cursor-pointer transition-all ${selected ? 'ring-2 ring-forest-500 border-forest-300' : ''}`}
                onClick={() => toggleNeighbour(neighbour)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-charcoal-900">{neighbour.name}</h4>
                      <span className="flex items-center gap-1 text-xs text-charcoal-600">
                        <MapPin size={12} /> {neighbour.distance} km
                      </span>
                      {isCompatible ? (
                        <span className="flex items-center gap-1 text-xs text-forest-700 bg-forest-50 px-1.5 py-0.5 rounded">
                          <CheckCircle size={10} /> {t('agg.compatible')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          <AlertCircle size={10} /> {t('agg.limitedOverlap')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">
                      {neighbour.households} {t('agg.households')} · {neighbour.agriculturalLand} ha {t('agg.agricultural')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {neighbour.methodologyOverlap.map((m) => (
                        <span key={m} className={`px-2 py-0.5 rounded text-xs ${
                          sharedMethodologies.includes(m)
                            ? 'bg-forest-100 text-forest-800'
                            : 'bg-earth-100 text-charcoal-700'
                        }`}>
                          {m}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm font-medium text-forest-700 mt-2">
                      {formatRange(neighbour.carbonPotential)} tCO₂e/year
                    </div>
                  </div>
                  <button
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      selected
                        ? 'bg-forest-600 text-white'
                        : 'bg-earth-100 text-charcoal-600 hover:bg-earth-200'
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleNeighbour(neighbour); }}
                    aria-label={selected ? t('agg.remove') : 'Add to cluster'}
                  >
                    {selected ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Combined result */}
      {selectedNeighbours.length > 0 && (
        <div className="card bg-forest-800 text-white animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-forest-300" />
            <h3 className="font-semibold">{t('agg.combined')}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-forest-300">{t('agg.panchayats')}</div>
              <div className="text-lg font-bold">{selectedNeighbours.length + 1}</div>
            </div>
            <div>
              <div className="text-xs text-forest-300">{t('agg.hh')}</div>
              <div className="text-lg font-bold">{combined.households}</div>
            </div>
            <div>
              <div className="text-xs text-forest-300">{t('agg.mitPotential')}</div>
              <div className="text-lg font-bold">{formatRange(combined.carbon)} tCO₂e/yr</div>
            </div>
            <div>
              <div className="text-xs text-forest-300">{t('agg.scaleImprove')}</div>
              <div className="text-lg font-bold">
                +{Math.round((combined.carbon[1] / panchayat.carbonPotential.total[1] - 1) * 100)}%
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-forest-600">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-forest-300" />
              <span className="text-sm font-semibold">{t('agg.compatCheck')}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { label: t('agg.compatMethod'), check: true },
                { label: t('agg.compatActivity'), check: true },
                { label: t('agg.compatMonitor'), check: false },
                { label: t('agg.compatScale'), check: combined.carbon[0] > 900 },
                { label: t('agg.compatBoundary'), check: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.check ? (
                    <CheckCircle size={12} className="text-forest-300" />
                  ) : (
                    <AlertCircle size={12} className="text-amber-300" />
                  )}
                  <span className="text-xs text-forest-200">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-forest-200 mt-3">
            {t('agg.improves')} — Aggregating with {selectedNeighbours.map(n => n.name).join(' and ')} brings
            the combined mitigation potential significantly above the viability threshold.
          </p>
        </div>
      )}

      {/* Math visualization */}
      {selectedNeighbours.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-sm text-charcoal-900 mb-4">{t('agg.clusterCalc')}</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-forest-100 text-forest-800 px-3 py-2 rounded font-medium">
              {panchayat.name}: {formatRange(panchayat.carbonPotential.total)}
            </span>
            {selectedNeighbours.map((n) => (
              <span key={n.name} className="flex items-center gap-2">
                <span className="text-charcoal-500">+</span>
                <span className="bg-earth-100 text-charcoal-800 px-3 py-2 rounded font-medium">
                  {n.name}: {formatRange(n.carbonPotential)}
                </span>
              </span>
            ))}
            <span className="text-charcoal-500">=</span>
            <span className="bg-forest-700 text-white px-3 py-2 rounded font-bold">
              {t('agg.combinedLabel')} {formatRange(combined.carbon)} tCO₂e/yr
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => navigate('/viability')} className="btn-secondary">
          ← {t('common.back')}
        </button>
        <button onClick={() => navigate('/readiness')} className="btn-primary flex items-center gap-2">
          {t('common.next')}: {t('nav.readiness')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
