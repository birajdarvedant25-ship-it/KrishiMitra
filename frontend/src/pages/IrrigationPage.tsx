import React, { useState } from 'react';
import {
  Droplets,
  CloudSun,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useFarm } from '../context/FarmContext.js';
import { api } from '../services/api.js';
import { VoiceReader } from '../components/common/VoiceReader.js';

export const IrrigationPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { weather, crops } = useFarm();

  const [selectedCrop, setSelectedCrop] = useState<string>(crops[0]?.cropName || 'Tomato');
  const [stage, setStage] = useState<string>('Flowering & Fruit Set');
  const [soilType, setSoilType] = useState<string>('Medium Black Soil');
  const [method, setMethod] = useState<string>('Drip Irrigation');
  const [moistureFeel, setMoistureFeel] = useState<'dry' | 'moderate' | 'wet'>('moderate');

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<any | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const res = await api.irrigation.calculate({
        cropName: selectedCrop,
        growthStage: stage,
        soilType,
        irrigationMethod: method,
        soilMoistureLevel: moistureFeel,
        language,
        upcomingRainProbability: weather?.rainProbability,
        temperature: weather?.temperature
      });

      if (res.success && res.recommendation) {
        setRecommendation(res.recommendation);
      }
    } catch (err) {
      console.warn('Irrigation calculation failed:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {t('irrigationPage.title')}
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          {t('irrigationPage.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Crop */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t('irrigationPage.formCrop')}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Tomato">Tomato (टोमॅटो / टमाटर)</option>
                <option value="Cotton">Cotton (कापूस / कपास)</option>
                <option value="Chilli">Chilli (मिरची / मिर्च)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Onion">Onion (कांदा / प्याज)</option>
                <option value="Wheat">Wheat (गहू / गेहूं)</option>
                <option value="Sugarcane">Sugarcane (ऊस / गन्ना)</option>
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t('irrigationPage.formStage')}
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Seedling / Germination">Seedling / Germination (उगवण / अंकुरण)</option>
                <option value="Vegetative Growth">Vegetative Growth (शाकीय वाढ / वानस्पतिक)</option>
                <option value="Flowering & Fruit Set">Flowering & Fruit Set (फुलोरा व फळधारणा)</option>
                <option value="Ripening / Maturity">Ripening / Harvest (पक्वता / तुड़ाई पूर्व)</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t('irrigationPage.formSoil')}
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Medium Black Soil">Medium Black Soil (मध्यम काळी जमीन)</option>
                <option value="Deep Black Soil">Deep Black Soil (भारी काळी जमीन)</option>
                <option value="Sandy Loam">Sandy Loam / Light Soil (हलकी / वाळूयुक्त जमीन)</option>
                <option value="Clay Loam">Clay Loam (चिकणमाती / दोमट)</option>
              </select>
            </div>

            {/* Irrigation Method */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t('irrigationPage.formMethod')}
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Drip Irrigation">Drip Irrigation (ठिबक सिंचन - Drip)</option>
                <option value="Sprinkler">Sprinkler (तुषार सिंचन)</option>
                <option value="Flood / Furrow">Flood / Furrow (पाटपाणी / वाफे)</option>
              </select>
            </div>

            {/* Current Soil Feel */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t('irrigationPage.formSoilMoisture')}
              </label>
              <div className="space-y-2">
                {[
                  { id: 'dry', label: t('irrigationPage.moistureDry') },
                  { id: 'moderate', label: t('irrigationPage.moistureModerate') },
                  { id: 'wet', label: t('irrigationPage.moistureWet') }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                      moistureFeel === item.id
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="moisture"
                      checked={moistureFeel === item.id}
                      onChange={() => setMoistureFeel(item.id as any)}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              <Droplets className="w-4 h-4" />
              <span>{isCalculating ? t('irrigationPage.calculating') : t('irrigationPage.calculateBtn')}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-6 space-y-4">
          {recommendation ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-blue-300 shadow-sm space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    recommendation.status === 'delay_irrigation'
                      ? 'bg-amber-100 text-amber-900'
                      : recommendation.status === 'irrigate_now'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {recommendation.title}
                  </span>
                  <p className="text-xs text-stone-500 mt-1.5 font-medium">
                    {selectedCrop} • {soilType}
                  </p>
                </div>
                <VoiceReader textToRead={`${recommendation.title}. ${recommendation.reason}. ${recommendation.suggestedAction}`} />
              </div>

              {/* Why this recommendation */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <p className="text-xs font-bold text-stone-800">{t('irrigationPage.reasonTitle')}</p>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {recommendation.reason}
                </p>
              </div>

              {/* Weather & Soil details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <p className="font-bold text-blue-900 mb-1">{t('irrigationPage.weatherInfluence')}</p>
                  <p className="text-blue-800">{recommendation.weatherInfluence}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200">
                  <p className="font-bold text-stone-800 mb-1">{t('irrigationPage.soilNotes')}</p>
                  <p className="text-stone-700">{recommendation.soilConsiderations}</p>
                </div>
              </div>

              {/* Practical Field Test */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('irrigationPage.actionSteps')}</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  {recommendation.suggestedAction}
                </p>
              </div>

              {/* Water Saving Tip */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 text-xs text-amber-950 border border-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>{t('irrigationPage.waterTip')}:</strong> {recommendation.waterSavingTip}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-3xl p-8 border-2 border-dashed border-stone-200 text-center flex flex-col items-center justify-center min-h-[360px] text-stone-400">
              <Droplets className="w-12 h-12 text-blue-300 mb-3" />
              <p className="text-sm font-bold text-stone-700">No Calculation Run Yet</p>
              <p className="text-xs text-stone-500 max-w-xs mt-1">
                Select your crop, soil, and moisture condition on the left, then click Calculate Watering Advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
