import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  CloudSun,
  Droplets,
  Bot
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

export const MobileNav: React.FC = () => {
  const { t } = useLanguage();

  const links = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/disease-detection', label: t('nav.diseaseDetection'), icon: Camera, highlight: true },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/irrigation', label: t('nav.irrigation'), icon: Droplets },
    { to: '/ai-assistant', label: t('nav.aiAssistant'), icon: Bot },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around h-16 px-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-0.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-xl transition-all ${
                      link.highlight
                        ? isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-emerald-100 text-emerald-800'
                        : isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="truncate max-w-[64px] text-center mt-0.5 leading-tight">
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
