import React, { useState } from 'react';
import { MapPin, Navigation, X, Check, Loader2 } from 'lucide-react';
import { useFarm } from '../../context/FarmContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface LocationModalProps {
  onClose: () => void;
}

const DISTRICT_LIST = [
  'Pune', 'Nashik', 'Ahmednagar', 'Nagpur', 'Chhatrapati Sambhajinagar',
  'Solapur', 'Kolhapur', 'Satara', 'Sangli', 'Jalgaon',
  'Amravati', 'Nanded', 'Latur', 'Akola', 'Buldhana',
  'Beed', 'Dhule', 'Jalna', 'Dharashiv', 'Parbhani',
  'Yavatmal', 'Wardha', 'Chandrapur', 'Mumbai', 'Thane', 'Ratnagiri',
  'New Delhi', 'Bhopal', 'Lucknow', 'Hyderabad', 'Bengaluru'
];

export const LocationModal: React.FC<LocationModalProps> = ({ onClose }) => {
  const { location, setLocation, detectLocationGPS } = useFarm();
  const { t, language } = useLanguage();
  const [isDetecting, setIsDetecting] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleGpsDetect = async () => {
    setIsDetecting(true);
    setGpsError(null);
    const success = await detectLocationGPS();
    setIsDetecting(false);
    if (success) {
      onClose();
    } else {
      setGpsError(
        language === 'mr'
          ? 'स्थान ओळखता आले नाही. कृपया खालील यादीतून आपला जिल्हा निवडा.'
          : language === 'hi'
          ? 'स्थान प्राप्त नहीं हो सका। कृपया नीचे दी गई सूची से अपना जिला चुनें।'
          : 'Unable to detect location. Please select your district from the list below.'
      );
    }
  };

  const filteredDistricts = DISTRICT_LIST.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {t('dashboard.changeLocation')}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'mr'
                  ? 'अचूक हवामान व सिंचन सल्ल्यासाठी'
                  : language === 'hi'
                  ? 'सटीक मौसम एवं सिंचाई परामर्श के लिए'
                  : 'For accurate hyper-local weather & advisories'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* GPS Auto Button */}
          <button
            onClick={handleGpsDetect}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60"
          >
            {isDetecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{t('onboarding.useGps')}</span>
          </button>

          {gpsError && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              {gpsError}
            </p>
          )}

          <div className="relative flex items-center py-1">
            <div className="grow border-t border-stone-200"></div>
            <span className="shrink mx-3 text-xs text-stone-400 font-medium uppercase">
              {t('onboarding.orManual')}
            </span>
            <div className="grow border-t border-stone-200"></div>
          </div>

          {/* Search Box */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'mr' ? 'जिल्हा शोधा...' : language === 'hi' ? 'जिला खोजें...' : 'Search district...'}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />

          {/* Districts List */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {filteredDistricts.map((district) => {
              const isSelected = location.toLowerCase().includes(district.toLowerCase());
              return (
                <button
                  key={district}
                  onClick={() => {
                    setLocation(district);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>{district}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
