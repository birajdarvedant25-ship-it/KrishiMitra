import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  CloudRain,
  MapPin,
  ShieldAlert,
  Thermometer,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useFarm } from '../context/FarmContext.js';
import { LocationModal } from '../components/common/LocationModal.js';

export const WeatherPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { location, weather, isLoadingWeather } = useFarm();
  const [showLocationModal, setShowLocationModal] = useState(false);

  if (isLoadingWeather || !weather) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-stone-500 text-sm">{t('common.loading')}</p>
      </div>
    );
  }

  const spray = weather.agriculturalImpact?.spraySuitability;
  const sprayReason = spray?.reason?.[language] || spray?.reason?.en || '';
  const irrigationAdvice = weather.agriculturalImpact?.irrigationAdvice?.[language] || weather.agriculturalImpact?.irrigationAdvice?.en || '';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {t('weatherPage.title')}
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {t('weatherPage.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowLocationModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 text-stone-700 text-xs font-bold shadow-xs transition-colors"
        >
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{location}</span>
          <span className="text-emerald-700 font-bold ml-1">Change</span>
        </button>
      </div>

      {/* Main Current Conditions Hero */}
      <div className="bg-linear-to-br from-emerald-700 via-green-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs">
              Live Observation • {location}
            </span>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight">
                {weather.temperature}°C
              </span>
              <div className="text-emerald-100 text-sm font-medium">
                <p>{weather.condition}</p>
                <p className="text-xs opacity-80">{t('dashboard.feelsLike')} {weather.feelsLike}°C</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <div className="flex items-center gap-1.5 text-xs text-blue-200">
                <CloudRain className="w-4 h-4" />
                <span>{t('dashboard.chanceOfRain')}</span>
              </div>
              <p className="text-lg font-bold mt-1">{weather.rainProbability}%</p>
              <p className="text-[10px] text-emerald-200">{weather.rainfallMm} mm rainfall</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                <Droplets className="w-4 h-4" />
                <span>{t('dashboard.humidity')}</span>
              </div>
              <p className="text-lg font-bold mt-1">{weather.humidity}%</p>
              <p className="text-[10px] text-emerald-200">Relative moisture</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-200">
                <Wind className="w-4 h-4" />
                <span>{t('dashboard.wind')}</span>
              </div>
              <p className="text-lg font-bold mt-1">{weather.windSpeed} km/h</p>
              <p className="text-[10px] text-emerald-200">Wind velocity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agricultural Weather Impacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Spray Suitability */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-stone-900 text-sm">{t('weatherPage.sprayTitle')}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                spray?.status === 'good'
                  ? 'bg-emerald-100 text-emerald-800'
                  : spray?.status === 'caution'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {spray?.status?.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mt-2">
              {sprayReason}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Optimal spray window: Early morning (7-9 AM)</span>
          </div>
        </div>

        {/* Fungal & Pest Threat Index */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-stone-900 text-sm">{t('weatherPage.fungalTitle')}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                weather.agriculturalImpact.fungalDiseaseRisk === 'high'
                  ? 'bg-red-100 text-red-800'
                  : weather.agriculturalImpact.fungalDiseaseRisk === 'medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {weather.agriculturalImpact.fungalDiseaseRisk?.toUpperCase()} RISK
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mt-2">
              {weather.humidity > 80
                ? 'High humidity creates prime conditions for downy mildew, blights, and rots.'
                : 'Moderate moisture levels. Keep scouting lower plant leaves regularly.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Keep crop rows aerated and sanitized</span>
          </div>
        </div>

        {/* Weather Impact on Watering */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-stone-900 text-sm">{t('weatherPage.irrigationTitle')}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mt-2">
              {irrigationAdvice}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500">
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>Water in evening to prevent evaporation</span>
          </div>
        </div>
      </div>

      {/* 5-Day Farm Forecast Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-stone-900 text-base">
            {t('weatherPage.forecast5Day')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {(weather.forecast || []).map((day: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/10'
                  : 'bg-stone-50 border-stone-200/70 hover:bg-stone-100/60'
              }`}
            >
              <p className="text-xs font-bold text-stone-500 uppercase">{day.dayName}</p>
              <p className="text-sm font-bold text-stone-800 mt-1">{day.condition}</p>
              <div className="my-3 flex items-baseline justify-center gap-1.5">
                <span className="text-2xl font-black text-stone-900">{day.maxTemp}°</span>
                <span className="text-xs text-stone-400 font-bold">{day.minTemp}°</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
                <CloudRain className="w-3 h-3" />
                <span>{day.rainProbability}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLocationModal && (
        <LocationModal onClose={() => setShowLocationModal(false)} />
      )}
    </div>
  );
};
