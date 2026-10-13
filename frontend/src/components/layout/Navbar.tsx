import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  CloudSun,
  Droplets,
  Bot,
  Sprout,
  Bell,
  Settings
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();

  const links = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/disease-detection', label: t('nav.diseaseDetection'), icon: Camera },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/irrigation', label: t('nav.irrigation'), icon: Droplets },
    { to: '/ai-assistant', label: t('nav.aiAssistant'), icon: Bot },
    { to: '/crops', label: t('nav.myCrops'), icon: Sprout },
    { to: '/alerts', label: t('nav.alerts'), icon: Bell },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav className="hidden lg:block bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 py-1.5 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/80 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
