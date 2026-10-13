import React, { useState, useEffect } from 'react';
import { User, Sprout, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage, Language } from '../context/LanguageContext.js';
import { api } from '../services/api.js';

export const ProfilePage: React.FC = () => {
  const { user, profile, refreshUser } = useAuth();
  const { t, setLanguage } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [district, setDistrict] = useState(user?.district || 'Pune');
  const [village, setVillage] = useState(user?.village || '');
  const [prefLang, setPrefLang] = useState<Language>(user?.preferredLanguage || 'mr');
  const [farmSize, setFarmSize] = useState(profile?.farmSizeAcres?.toString() || '2.5');
  const [soilType, setSoilType] = useState(profile?.soilType || 'Medium Black Soil');
  const [irrigation, setIrrigation] = useState(profile?.irrigationMethod || 'Drip Irrigation');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setDistrict(user.district);
      setVillage(user.village || '');
      setPrefLang(user.preferredLanguage);
    }
    if (profile) {
      setFarmSize(profile.farmSizeAcres?.toString() || '2.5');
      setSoilType(profile.soilType || 'Medium Black Soil');
      setIrrigation(profile.irrigationMethod || 'Drip Irrigation');
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      await api.profile.update({
        name,
        district,
        village,
        preferredLanguage: prefLang,
        farmSizeAcres: parseFloat(farmSize) || undefined,
        soilType,
        irrigationMethod: irrigation
      });
      setLanguage(prefLang);
      await refreshUser();
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      console.warn('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 animate-in fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Farmer Profile
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          Manage your personal details, farm size, and soil characteristics
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">{t('auth.fullName')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">{t('auth.preferredLanguage')}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिन्दी' },
                { id: 'mr', label: 'मराठी' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setPrefLang(item.id as Language)}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    prefLang === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('auth.district')}</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('auth.village')}</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>
          </div>

          <div className="border-t border-stone-100 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('onboarding.farmSize')}</label>
              <input
                type="number"
                step="0.5"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('onboarding.soilType')}</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="Medium Black Soil">Medium Black Soil</option>
                <option value="Deep Black Soil">Deep Black Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Clay Loam">Clay Loam</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('onboarding.irrigationType')}</label>
              <select
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Flood / Furrow">Flood / Furrow</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
};
