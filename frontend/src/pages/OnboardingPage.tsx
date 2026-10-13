import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Globe,
  MapPin,
  Check,
  Navigation,
  ArrowRight,
  ArrowLeft,
  Layers,
  Droplets,
  Loader2
} from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useFarm } from '../context/FarmContext.js';

const AVAILABLE_CROPS = [
  { id: 'tomato', name: 'Tomato (टोमॅटो / टमाटर)', icon: '🍅' },
  { id: 'cotton', name: 'Cotton (कापूस / कपास)', icon: '🌱' },
  { id: 'chilli', name: 'Chilli (मिरची / मिर्च)', icon: '🌶️' },
  { id: 'soybean', name: 'Soybean (सोयाबीन)', icon: '🌾' },
  { id: 'onion', name: 'Onion (कांदा / प्याज)', icon: '🧅' },
  { id: 'wheat', name: 'Wheat (गहू / गेहूं)', icon: '🌾' },
  { id: 'sugarcane', name: 'Sugarcane (ऊस / गन्ना)', icon: '🎋' }
];

const DISTRICT_LIST = [
  'Pune', 'Nashik', 'Ahmednagar', 'Nagpur', 'Chhatrapati Sambhajinagar',
  'Solapur', 'Kolhapur', 'Satara', 'Sangli', 'Jalgaon',
  'Amravati', 'Nanded', 'Latur', 'Akola', 'Buldhana',
  'Beed', 'Dhule', 'Jalna', 'Dharashiv', 'Parbhani',
  'Yavatmal', 'Wardha', 'Chandrapur', 'Mumbai', 'Thane', 'Ratnagiri'
];

export const OnboardingPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { completeOnboarding, user } = useAuth();
  const { location, setLocation, detectLocationGPS, refreshCrops } = useFarm();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(user?.district || location || 'Pune');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const [selectedCrops, setSelectedCrops] = useState<string[]>(['tomato']);
  const [farmSize, setFarmSize] = useState<string>('2.5');
  const [soilType, setSoilType] = useState<string>('Medium Black Soil');
  const [irrigationMethod, setIrrigationMethod] = useState<string>('Drip Irrigation');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleCrop = (cropId: string) => {
    if (selectedCrops.includes(cropId)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== cropId));
    } else {
      setSelectedCrops([...selectedCrops, cropId]);
    }
  };

  const handleGpsDetect = async () => {
    setIsDetectingGps(true);
    setGpsMessage(null);
    const success = await detectLocationGPS();
    setIsDetectingGps(false);
    if (success) {
      setGpsMessage('Location detected accurately!');
    } else {
      setGpsMessage('Could not acquire GPS. Please choose your district manually.');
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const cropsToSave = selectedCrops.map((cid) => {
        const found = AVAILABLE_CROPS.find((c) => c.id === cid);
        return { name: found?.name.split(' (')[0] || cid };
      });

      await completeOnboarding({
        preferredLanguage: selectedLanguage,
        state: 'Maharashtra',
        district: selectedDistrict,
        crops: cropsToSave,
        farmSizeAcres: parseFloat(farmSize) || 2.5,
        soilType,
        irrigationMethod
      });

      setLocation(selectedDistrict);
      await refreshCrops();
      navigate('/dashboard');
    } catch (err) {
      console.warn('Onboarding save failed:', err);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 sm:my-10 px-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
        {/* Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>Step {step} of 5</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-stone-400 hover:text-emerald-700 font-semibold"
            >
              {t('onboarding.skip')}
            </button>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/10">
              <Sprout className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {t('onboarding.welcomeTitle')}
              </h2>
              <p className="text-stone-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                {t('onboarding.welcomeDesc')}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>{t('onboarding.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LANGUAGE SELECTION */}
        {step === 2 && (
          <div className="space-y-6 py-2">
            <div>
              <h2 className="text-xl font-black text-stone-900">
                {t('onboarding.step1Title')}
              </h2>
              <p className="text-stone-500 text-xs mt-1">
                {t('onboarding.step1Desc')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'mr', title: 'मराठी — Marathi', desc: 'महाराष्ट्रातील शेतकऱ्यांसाठी सहज आणि सोपी' },
                { id: 'hi', title: 'हिन्दी — Hindi', desc: 'भारतीय किसानों के लिए स्पष्ट एवं उपयोगी' },
                { id: 'en', title: 'English', desc: 'Global agricultural reference in simple English' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedLanguage(item.id as Language);
                    setLanguage(item.id as Language);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedLanguage === item.id
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-stone-900 text-sm">{item.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
                  </div>
                  {selectedLanguage === item.id && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                {t('onboarding.back')}
              </button>
              <button
                onClick={() => setStep(3)}
                className="grow py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t('onboarding.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {step === 3 && (
          <div className="space-y-6 py-2">
            <div>
              <h2 className="text-xl font-black text-stone-900">
                {t('onboarding.step2Title')}
              </h2>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                {t('onboarding.step2Desc')}
              </p>
            </div>

            <button
              onClick={handleGpsDetect}
              disabled={isDetectingGps}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isDetectingGps ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              <span>{t('onboarding.useGps')}</span>
            </button>

            {gpsMessage && (
              <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                {gpsMessage}
              </p>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                {t('onboarding.orManual')} (District):
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-semibold bg-white"
              >
                {DISTRICT_LIST.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                {t('onboarding.back')}
              </button>
              <button
                onClick={() => setStep(4)}
                className="grow py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t('onboarding.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SELECT CROPS */}
        {step === 4 && (
          <div className="space-y-6 py-2">
            <div>
              <h2 className="text-xl font-black text-stone-900">
                {t('onboarding.step3Title')}
              </h2>
              <p className="text-stone-500 text-xs mt-1">
                {t('onboarding.step3Desc')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {AVAILABLE_CROPS.map((crop) => {
                const isSelected = selectedCrops.includes(crop.id);
                return (
                  <button
                    key={crop.id}
                    onClick={() => handleToggleCrop(crop.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{crop.icon}</span>
                      <span className="text-xs text-stone-800 font-semibold">{crop.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                {t('onboarding.back')}
              </button>
              <button
                onClick={() => setStep(5)}
                className="grow py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t('onboarding.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: FARM DETAILS & FINISH */}
        {step === 5 && (
          <div className="space-y-5 py-2">
            <div>
              <h2 className="text-xl font-black text-stone-900">
                {t('onboarding.step4Title')}
              </h2>
              <p className="text-stone-500 text-xs mt-1">
                {t('onboarding.step4Desc')}
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">{t('onboarding.farmSize')}</label>
                <input
                  type="number"
                  step="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">{t('onboarding.soilType')}</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  <option value="Medium Black Soil">Medium Black Soil (मध्यम काळी जमीन)</option>
                  <option value="Deep Black Soil">Deep Black Soil (भारी काळी जमीन)</option>
                  <option value="Sandy Loam">Sandy Loam (हलकी / वाळूयुक्त जमीन)</option>
                  <option value="Clay Loam">Clay Loam (गाळाची / चिकणमाती)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">{t('onboarding.irrigationType')}</label>
                <select
                  value={irrigationMethod}
                  onChange={(e) => setIrrigationMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  <option value="Drip Irrigation">Drip Irrigation (ठिबक सिंचन)</option>
                  <option value="Sprinkler">Sprinkler (तुषार सिंचन)</option>
                  <option value="Flood / Furrow">Flood / Furrow (पाटपाणी)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setStep(4)}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                {t('onboarding.back')}
              </button>
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="grow py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sprout className="w-4 h-4" />}
                <span>{t('onboarding.finish')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
