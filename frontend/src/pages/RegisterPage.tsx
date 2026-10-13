import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage, Language } from '../context/LanguageContext.js';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [village, setVillage] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(language);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setPrefLang(lang);
    setLanguage(lang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register({
        name,
        emailOrPhone,
        password,
        preferredLanguage: prefLang,
        state: 'Maharashtra',
        district,
        village
      });
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10 px-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-5">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-xs text-stone-500">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 text-red-800 text-xs border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Language Preference */}
          <div>
            <label className="block font-bold text-stone-700 mb-1.5">
              {t('auth.preferredLanguage')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिन्दी' },
                { id: 'mr', label: 'मराठी' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleLanguageSelect(item.id as Language)}
                  className={`py-2 px-1 rounded-xl font-bold border transition-all ${
                    prefLang === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">{t('auth.fullName')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('auth.fullNamePlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">{t('auth.emailOrPhone')}</label>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={t('auth.emailOrPhonePlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">{t('auth.password')}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('auth.district')}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="Pune">Pune (पुणे)</option>
                <option value="Nashik">Nashik (नाशिक)</option>
                <option value="Ahmednagar">Ahmednagar (अहिल्यानगर)</option>
                <option value="Nagpur">Nagpur (नागपूर)</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                <option value="Solapur">Solapur (सोलापूर)</option>
                <option value="Kolhapur">Kolhapur (कोल्हापूर)</option>
                <option value="Satara">Satara (सातारा)</option>
                <option value="Sangli">Sangli (सांगली)</option>
                <option value="Jalgaon">Jalgaon (जळगाव)</option>
                <option value="Amravati">Amravati (अमरावती)</option>
                <option value="Latur">Latur (लातूर)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('auth.village')}</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('auth.registering')}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{t('auth.registerButton')}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-600">
          <span>{t('auth.alreadyHaveAccount')} </span>
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};
