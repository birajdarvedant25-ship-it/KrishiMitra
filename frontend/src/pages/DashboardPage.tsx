import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CloudSun,
  Droplets,
  Bot,
  Sprout,
  Wind,
  CloudRain,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useFarm } from '../context/FarmContext.js';
import { api } from '../services/api.js';
import { VoiceReader } from '../components/common/VoiceReader.js';

export const DashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { location, weather, isLoadingWeather, crops } = useFarm();
  const [advisoryData, setAdvisoryData] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.advisor.getDaily(location, language).then((res) => {
      if (isMounted && res.success) {
        setAdvisoryData(res.advisory);
      }
    }).catch(console.warn);

    return () => {
      isMounted = false;
    };
  }, [location, language]);

  const activeCropNames = crops.map((c) => c.cropName).join(', ') || (
    language === 'mr' ? 'टोमॅटो, कापूस' : language === 'hi' ? 'टमाटर, कपास' : 'Tomato, Cotton'
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-emerald-800 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-xs mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.name ? `${t('dashboard.greeting')}, ${user.name} 👨‍🌾` : `${t('dashboard.greeting')} 👨‍🌾`}
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-xl">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <Link
            to="/disease-detection"
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all hover:scale-102"
          >
            <Camera className="w-5 h-5 text-stone-900" />
            <span>{t('dashboard.actionDetect')}</span>
          </Link>
        </div>
      </div>

      {/* Grid: Live Weather & Farm Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-stone-900">
                {t('dashboard.weatherCardTitle')} — {location}
              </h2>
            </div>
            <Link
              to="/weather"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{t('dashboard.actionWeather')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingWeather ? (
            <div className="py-8 flex items-center justify-center text-stone-400 text-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-2"></div>
              {t('common.loading')}
            </div>
          ) : weather ? (
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
                      {weather.temperature}°C
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {t('dashboard.feelsLike')} {weather.feelsLike}°C
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-stone-700 mt-0.5">
                    {weather.condition}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-right">
                  <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                    <div className="flex items-center justify-end gap-1 text-xs text-blue-600 font-medium">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>{t('dashboard.chanceOfRain')}</span>
                    </div>
                    <p className="text-base font-bold text-stone-800 mt-0.5">
                      {weather.rainProbability}%
                    </p>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                    <div className="flex items-center justify-end gap-1 text-xs text-emerald-700 font-medium">
                      <Wind className="w-3.5 h-3.5" />
                      <span>{t('dashboard.wind')}</span>
                    </div>
                    <p className="text-base font-bold text-stone-800 mt-0.5">
                      {weather.windSpeed} km/h
                    </p>
                  </div>
                </div>
              </div>

              {/* 4-Day Quick Forecast Row */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-100 text-center">
                {(weather.forecast || []).slice(1, 5).map((f: any, idx: number) => (
                  <div key={idx} className="p-2 rounded-xl bg-stone-50/70 border border-stone-100">
                    <p className="text-[11px] font-bold text-stone-500 uppercase">{f.dayName}</p>
                    <p className="text-sm font-bold text-stone-800 mt-0.5">{f.maxTemp}°</p>
                    <p className="text-[10px] text-blue-600 font-semibold">{f.rainProbability}% rain</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-500 py-6 text-center">Weather unavailable</p>
          )}
        </div>

        {/* Farm Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-stone-900">{t('dashboard.farmStatus')}</h2>
              </div>
              <Link to="/crops" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                {t('dashboard.actionCrops')}
              </Link>
            </div>

            <div className="pt-4 space-y-3">
              <div>
                <p className="text-xs text-stone-500">{t('dashboard.activeCrops')}:</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{activeCropNames}</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900">{t('dashboard.spraySuitability')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    weather?.agriculturalImpact?.spraySuitability?.status === 'good'
                      ? 'bg-emerald-200 text-emerald-900'
                      : weather?.agriculturalImpact?.spraySuitability?.status === 'caution'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-red-200 text-red-900'
                  }`}>
                    {weather?.agriculturalImpact?.spraySuitability?.status?.toUpperCase() || 'GOOD'}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-snug">
                  {weather?.agriculturalImpact?.spraySuitability?.reason?.[language] ||
                   weather?.agriculturalImpact?.spraySuitability?.reason?.en ||
                   'Favorable conditions for field applications.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">{t('dashboard.fungalRisk')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    weather?.agriculturalImpact?.fungalDiseaseRisk === 'high'
                      ? 'bg-red-100 text-red-800'
                      : weather?.agriculturalImpact?.fungalDiseaseRisk === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {weather?.agriculturalImpact?.fungalDiseaseRisk?.toUpperCase() || 'LOW'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/irrigation"
            className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Droplets className="w-4 h-4 text-blue-600" />
            <span>{t('dashboard.actionIrrigation')}</span>
          </Link>
        </div>
      </div>

      {/* AI Daily Farm Advisory Summary */}
      {advisoryData && (
        <div className="bg-linear-to-br from-emerald-50 via-white to-green-50 rounded-3xl p-6 border border-emerald-200 shadow-xs relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  {t('dashboard.advisoryTitle')}
                </h3>
                <p className="text-[11px] text-emerald-800 font-medium">
                  {advisoryData.weatherSummary}
                </p>
              </div>
            </div>

            <VoiceReader textToRead={`${advisoryData.farmingAdvice} ${advisoryData.irrigationTip} ${advisoryData.diseaseWarning}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-sm text-stone-700">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800 mb-1">🌱 Field Advisory</p>
              <p className="text-xs leading-relaxed">{advisoryData.farmingAdvice}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-emerald-100">
              <p className="text-xs font-bold text-blue-800 mb-1">💧 Irrigation Note</p>
              <p className="text-xs leading-relaxed">{advisoryData.irrigationTip}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-emerald-100">
              <p className="text-xs font-bold text-amber-800 mb-1">🛡️ Disease Watch</p>
              <p className="text-xs leading-relaxed">{advisoryData.diseaseWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Large Quick Action Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          {t('dashboard.quickActions')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Disease Detect */}
          <Link
            to="/disease-detection"
            className="group bg-white rounded-3xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition-colors">
                {t('dashboard.actionDetect')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {t('dashboard.actionDetectDesc')}
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 gap-1">
              <span>Try now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Weather */}
          <Link
            to="/weather"
            className="group bg-white rounded-3xl p-5 border border-stone-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base group-hover:text-blue-700 transition-colors">
                {t('dashboard.actionWeather')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {t('dashboard.actionWeatherDesc')}
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Irrigation Advice */}
          <Link
            to="/irrigation"
            className="group bg-white rounded-3xl p-5 border border-stone-200 hover:border-cyan-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base group-hover:text-cyan-700 transition-colors">
                {t('dashboard.actionIrrigation')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {t('dashboard.actionIrrigationDesc')}
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-cyan-600 gap-1">
              <span>Calculate</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: AI Assistant */}
          <Link
            to="/ai-assistant"
            className="group bg-white rounded-3xl p-5 border border-stone-200 hover:border-purple-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base group-hover:text-purple-700 transition-colors">
                {t('dashboard.actionAssistant')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {t('dashboard.actionAssistantDesc')}
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-purple-600 gap-1">
              <span>Ask doubts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
