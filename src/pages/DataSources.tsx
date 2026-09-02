import { useNavigate } from 'react-router-dom';
import {
  Database, TreePine, Building2, MapPin, Satellite, Beef, Layers,
  FileCheck, ArrowRight, Shield, Users, ExternalLink,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { dataSources } from '../data/demo';
import { regulatorySnapshot, acvaDirectory } from '../data/regulatorySnapshot';
import ConfidenceIndicator from '../components/shared/ConfidenceIndicator';

const iconMap: Record<string, React.ReactNode> = {
  TreePine: <TreePine size={18} />,
  Building2: <Building2 size={18} />,
  MapPin: <MapPin size={18} />,
  Satellite: <Satellite size={18} />,
  Beef: <Beef size={18} />,
  Layers: <Layers size={18} />,
  FileCheck: <FileCheck size={18} />,
  ShieldCheck: <Shield size={18} />,
};

const confidenceLevel = (c: string) => c === 'high' ? 5 : c === 'medium' ? 3 : 1;

export default function DataSources() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-charcoal-900 flex items-center gap-2">
          <Database size={20} className="text-forest-700" />
          {t('data.title')}
        </h1>
        <p className="text-sm text-charcoal-600 mt-1">{t('data.subtitle')}</p>
      </div>

      {/* Regulatory Framework */}
      <div className="card bg-forest-50 border-forest-200">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-2 flex items-center gap-2">
          <Shield size={16} className="text-forest-600" />
          {t('data.regFramework')}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-charcoal-600">{t('data.legalBasis')}</span>
            <span className="font-medium text-charcoal-900 ml-1">{regulatorySnapshot.legalBasis}</span>
          </div>
          <div>
            <span className="text-charcoal-600">{t('data.scheme')}</span>
            <span className="font-medium text-charcoal-900 ml-1">{regulatorySnapshot.schemeName}</span>
          </div>
          <div>
            <span className="text-charcoal-600">{t('data.market')}</span>
            <span className="font-medium text-charcoal-900 ml-1">{regulatorySnapshot.frameworkName}</span>
          </div>
          <div>
            <span className="text-charcoal-600">{t('data.methodDB')}</span>
            <span className="font-medium text-charcoal-900 ml-1">v{regulatorySnapshot.methodologyVersion} ({regulatorySnapshot.methodologyLastUpdated})</span>
          </div>
        </div>
        <p className="text-xs text-charcoal-500 mt-2 italic">{regulatorySnapshot.disclaimer}</p>
      </div>

      {/* Institutional Roles */}
      <div className="card">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-3 flex items-center gap-2">
          <Users size={16} className="text-forest-600" />
          {t('data.whoDoesWhat')}
        </h3>
        <div className="space-y-2">
          {regulatorySnapshot.institutionalRoles.map((role) => (
            <div key={role.entity} className="flex items-start gap-3 p-3 rounded-md bg-earth-50 border border-sage-200">
              <div className="w-2 h-2 rounded-full bg-forest-500 mt-1.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-charcoal-900">{role.entity}</span>
                  <span className="text-xs text-charcoal-500 bg-sage-100 px-1.5 py-0.5 rounded">{role.role}</span>
                </div>
                <p className="text-xs text-charcoal-600 mt-0.5">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How Estimates Are Produced */}
      <div className="card bg-earth-50 border-sage-200">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-2">{t('data.howEstimates')}</h3>
        <p className="text-xs text-charcoal-700 leading-relaxed">{t('data.howEstText')}</p>
      </div>

      {/* Data source cards */}
      <div>
        <h3 className="font-semibold text-sm text-charcoal-900 mb-3">{t('data.dataSources')}</h3>
        <div className="space-y-3">
          {dataSources.map((source) => (
            <div key={source.name} className="card card-hover">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center shrink-0 text-forest-700">
                  {iconMap[source.icon] || <Database size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-charcoal-900">{source.name}</h3>
                    <ConfidenceIndicator level={confidenceLevel(source.confidence)} />
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="text-xs">
                      <span className="font-medium text-charcoal-700">{t('data.whatWeUse')} </span>
                      <span className="text-charcoal-600">{source.purpose}</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium text-charcoal-700">{t('data.whyWeUse')} </span>
                      <span className="text-charcoal-600">{source.whyWeUse}</span>
                    </div>
                    <div className="text-xs text-charcoal-500">
                      {t('data.lastUpdated')} {source.lastUpdated}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Sources */}
      <div className="card">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-3 flex items-center gap-2">
          <ExternalLink size={14} className="text-forest-600" />
          {t('data.regSources')}
        </h3>
        <div className="space-y-2">
          {regulatorySnapshot.officialSources.map((source) => (
            <div key={source.name} className="flex items-start gap-3 p-2 rounded-md bg-earth-50">
              <ExternalLink size={12} className="text-forest-600 mt-1 shrink-0" />
              <div>
                <span className="font-medium text-sm text-charcoal-900">{source.name}</span>
                <p className="text-xs text-charcoal-600">{source.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACVA Directory */}
      <div className="card">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-3 flex items-center gap-2">
          <Shield size={14} className="text-forest-600" />
          {t('data.acvaTitle')}
        </h3>
        <p className="text-xs text-charcoal-600 mb-3">{t('data.acvaNote')}</p>
        <div className="space-y-2">
          {acvaDirectory.map((agency) => (
            <div key={agency.agency} className="flex items-center justify-between p-3 rounded-md bg-earth-50 border border-sage-200">
              <div>
                <span className="font-medium text-sm text-charcoal-900">{agency.agency}</span>
                <p className="text-xs text-charcoal-600 mt-0.5">{agency.relevantSectors.join(', ')}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  agency.accreditationStatus === 'FINAL' ? 'text-forest-700 bg-forest-100' : 'text-amber-700 bg-amber-100'
                }`}>
                  {agency.accreditationStatus}
                </span>
                <p className="text-xs text-charcoal-500 mt-0.5">{agency.validity}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-charcoal-500 mt-2 italic">{t('data.acvaWarning')}</p>
      </div>

      {/* Open source note */}
      <div className="card bg-earth-50 border-sage-200">
        <h3 className="font-semibold text-sm text-charcoal-900 mb-2">{t('data.openSource')}</h3>
        <p className="text-xs text-charcoal-700 leading-relaxed">{t('data.openSourceText')}</p>
      </div>

      <div className="flex justify-between">
        <button onClick={() => navigate('/decision')} className="btn-secondary">
          ← {t('common.back')}
        </button>
        <button onClick={() => navigate('/about')} className="btn-primary flex items-center gap-2">
          {t('nav.about')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
