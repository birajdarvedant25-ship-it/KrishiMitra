import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, Bell, User as UserIcon, Globe, LogOut, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../../context/LanguageContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useFarm } from '../../context/FarmContext.js';
import { LocationModal } from '../common/LocationModal.js';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { location, unreadAlertsCount } = useFarm();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-emerald-900 flex items-center gap-1">
                {t('appName')}
              </span>
              <p className="text-[10px] text-stone-500 font-medium hidden sm:block leading-none">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location Chip */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-medium border border-emerald-200 transition-colors"
              title={t('dashboard.changeLocation')}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-[140px] font-semibold">{location}</span>
            </button>

            {/* Tri-lingual Switcher */}
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिं
              </button>
              <button
                onClick={() => handleLanguageChange('mr')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'mr'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                मरा
              </button>
            </div>

            {/* Alerts Bell */}
            <Link
              to="/alerts"
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              title={t('nav.alerts')}
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-stone-100 text-stone-700 text-sm font-medium transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-300">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden md:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-stone-200 py-1.5 text-sm z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-semibold text-stone-900 truncate">{user?.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user?.emailOrPhone}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      {t('nav.profile')}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      {t('nav.settings')}
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal onClose={() => setShowLocationModal(false)} />
      )}
    </>
  );
};
