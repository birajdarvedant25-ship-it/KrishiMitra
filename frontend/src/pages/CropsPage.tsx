import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Plus,
  Calendar,
  Layers,
  Droplets,
  ArrowRight,
  Trash2,
  X,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useFarm } from '../context/FarmContext.js';
import { api } from '../services/api.js';

export const CropsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { crops, refreshCrops, location } = useFarm();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('Tomato');
  const [variety, setVariety] = useState('');
  const [stage, setStage] = useState('Vegetative Growth');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [soil, setSoil] = useState('Medium Black Soil');
  const [irrigation, setIrrigation] = useState('Drip Irrigation');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.crops.create({
        cropName: name,
        variety,
        growthStage: stage,
        plantingDate,
        soilType: soil,
        irrigationMethod: irrigation,
        farmLocation: location,
        notes
      });
      await refreshCrops();
      setShowAddModal(false);
      // Reset form
      setVariety('');
      setNotes('');
    } catch (err) {
      console.warn('Failed to add crop:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCrop = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this crop?')) {
      await api.crops.delete(id);
      await refreshCrops();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in">
      {/* Title & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {t('cropsPage.title')}
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {t('cropsPage.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>{t('cropsPage.addNew')}</span>
        </button>
      </div>

      {/* Crops Cards Grid */}
      {crops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {crops.map((crop) => (
            <Link
              key={crop.id}
              to={`/crops/${crop.id}`}
              className="group bg-white rounded-3xl p-6 border border-stone-200/90 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition-colors">
                        {crop.cropName}
                      </h3>
                      {crop.variety && (
                        <p className="text-xs text-stone-500">{crop.variety}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteCrop(crop.id, e)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title={t('cropsPage.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">{t('cropsPage.stage')}:</span>
                    <span className="font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {crop.growthStage}
                    </span>
                  </div>

                  {crop.plantingDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 font-medium">{t('cropsPage.plantingDate')}:</span>
                      <span className="font-semibold text-stone-800">{crop.plantingDate}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">{t('cropsPage.irrigation')}:</span>
                    <span className="font-semibold text-stone-800">{crop.irrigationMethod || 'Drip'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>View Crop Health & Diseases</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center max-w-md mx-auto space-y-4">
          <Sprout className="w-12 h-12 text-emerald-500 mx-auto" />
          <p className="text-sm font-bold text-stone-800">{t('cropsPage.noCrops')}</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            {t('cropsPage.addNew')}
          </button>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-base">{t('cropsPage.addNew')}</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">{t('cropsPage.cropName')}</label>
                <select
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                >
                  <option value="Tomato">Tomato (टोमॅटो / टमाटर)</option>
                  <option value="Cotton">Cotton (कापूस / कपास)</option>
                  <option value="Chilli">Chilli (मिरची / मिर्च)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Onion">Onion (कांदा / प्याज)</option>
                  <option value="Wheat">Wheat (गहू / गेहूं)</option>
                  <option value="Sugarcane">Sugarcane (ऊस / गन्ना)</option>
                  <option value="Gram">Gram / Chickpea (हरभरा / चना)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">{t('cropsPage.variety')}</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Abhinav, RCH-2, G-4"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">{t('cropsPage.stage')}</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative Growth">Vegetative</option>
                    <option value="Flowering & Fruit Set">Flowering & Fruit</option>
                    <option value="Maturity">Maturity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">{t('cropsPage.plantingDate')}</label>
                  <input
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">{t('cropsPage.soil')}</label>
                  <select
                    value={soil}
                    onChange={(e) => setSoil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    <option value="Medium Black Soil">Medium Black Soil</option>
                    <option value="Deep Black Soil">Deep Black Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">{t('cropsPage.irrigation')}</label>
                  <select
                    value={irrigation}
                    onChange={(e) => setIrrigation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood / Furrow">Flood / Furrow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">{t('cropsPage.notes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Applied jeevamrut, installed sticky traps"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
              >
                {t('cropsPage.save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
