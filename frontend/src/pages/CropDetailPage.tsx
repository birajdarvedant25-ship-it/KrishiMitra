import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sprout,
  ArrowLeft,
  Calendar,
  Layers,
  Droplets,
  Camera,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';

export const CropDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();

  const [crop, setCrop] = useState<any | null>(null);
  const [knowledge, setKnowledge] = useState<any | null>(null);
  const [diseases, setDiseases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      api.crops.getById(id).then((res) => {
        if (res.success) {
          setCrop(res.crop);
          setKnowledge(res.knowledge);
          setDiseases(res.commonDiseases || []);
        }
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-stone-500 text-sm font-medium">{t('common.loading')}</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-stone-600 text-sm">Crop record not found.</p>
        <Link to="/crops" className="text-emerald-700 font-bold text-xs underline">
          Back to My Crops
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in">
      <Link
        to="/crops"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Crops</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {crop.cropName}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Variety: <strong className="text-stone-800">{crop.variety || 'Standard'}</strong> • Location: {crop.farmLocation || 'Farm'}
            </p>
          </div>
        </div>

        <Link
          to="/disease-detection"
          className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
        >
          <Camera className="w-4 h-4" />
          <span>Diagnose Crop Leaf</span>
        </Link>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <p className="text-stone-400 font-bold uppercase text-[10px]">Growth Stage</p>
          <p className="font-bold text-stone-800 mt-1 text-sm">{crop.growthStage}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <p className="text-stone-400 font-bold uppercase text-[10px]">Planting Date</p>
          <p className="font-bold text-stone-800 mt-1 text-sm">{crop.plantingDate || 'Not specified'}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <p className="text-stone-400 font-bold uppercase text-[10px]">Soil Type</p>
          <p className="font-bold text-stone-800 mt-1 text-sm">{crop.soilType || 'Black Soil'}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <p className="text-stone-400 font-bold uppercase text-[10px]">Irrigation</p>
          <p className="font-bold text-stone-800 mt-1 text-sm">{crop.irrigationMethod || 'Drip'}</p>
        </div>
      </div>

      {/* Common Diseases & Organic Protocols */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-stone-900 text-base">
            Common Diseases & Organic Management for {crop.cropName}
          </h2>
        </div>

        {diseases.length > 0 ? (
          <div className="space-y-4">
            {diseases.map((dis) => (
              <div
                key={dis.id}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">
                    {dis.name[language] || dis.name.en}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Organic Protocol
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-700">
                  <p className="font-bold text-emerald-900">Recommended Organic Solutions:</p>
                  <ul className="space-y-1 pl-4 list-disc text-stone-600">
                    {(dis.organicSolutions[language] || dis.organicSolutions.en || []).slice(0, 3).map((sol: string, idx: number) => (
                      <li key={idx}>{sol}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500">
            No specific disease threats logged for this crop. Continue standard preventive organic maintenance.
          </p>
        )}
      </div>
    </div>
  );
};
