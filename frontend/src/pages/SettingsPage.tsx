import React from 'react';
import { Globe, MapPin, Shield, Cpu, LogOut, Check } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext.js';
import { useFarm } from '../context/FarmContext.js';
import { useAuth } from '../context/AuthContext.js';

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { location } = useFarm();
  const { logout, isAuthenticated } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 animate-in fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          Configure application preferences and data permissions
        </p>
      </div>

      <div className="space-y-4">
        {/* Language Selection Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h3>{t('settings.language')}</h3>
          </div>
          <p className="text-xs text-stone-500">{t('settings.languageDesc')}</p>

          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {[
              { id: 'mr', title: 'मराठी', sub: 'Marathi' },
              { id: 'hi', title: 'हिन्दी', sub: 'Hindi' },
              { id: 'en', title: 'English', sub: 'English' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setLanguage(item.id as Language)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  language === item.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Location Info Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3>{t('settings.location')}</h3>
          </div>
          <p className="text-xs text-stone-500">{t('settings.locationDesc')}</p>
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 flex items-center justify-between">
            <span>Current Active Farm District:</span>
            <span className="text-emerald-700">{location}</span>
          </div>
        </div>

        {/* AI Operating Mode */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Cpu className="w-5 h-5 text-purple-600" />
            <h3>{t('settings.demoMode')}</h3>
          </div>
          <p className="text-xs text-stone-500">{t('settings.demoModeDesc')}</p>
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 flex items-center justify-between">
            <div>
              <p className="font-bold">Multi-AI Orchestrator Engine</p>
              <p className="text-[11px] text-purple-700">Primary: Gemini 1.5/2.0 • Fallback: OpenAI & Knowledge Engine</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-200 text-purple-900 font-extrabold text-[10px] uppercase">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Privacy & Trust Notice */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3>{t('settings.privacy')}</h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            {t('settings.privacyDesc')}
          </p>
        </div>

        {/* Logout Button */}
        {isAuthenticated && (
          <div className="pt-2">
            <button
              onClick={logout}
              className="w-full py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm border border-red-200 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
