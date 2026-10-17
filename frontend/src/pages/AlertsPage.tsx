import React from 'react';
import {
  Bell,
  CloudRain,
  Flame,
  Droplets,
  AlertTriangle,
  Bug,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useFarm } from '../context/FarmContext.js';
import { api } from '../services/api.js';

export const AlertsPage: React.FC = () => {
  const { t } = useLanguage();
  const { alerts, refreshAlerts } = useFarm();

  const handleMarkRead = async (id: string) => {
    try {
      await api.alerts.markRead(id);
      await refreshAlerts();
    } catch (err) {
      console.warn('Error marking alert read:', err);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'heat':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-cyan-600" />;
      case 'disease':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'pest':
        return <Bug className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {t('alertsPage.title')}
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          {t('alertsPage.subtitle')}
        </p>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-3xl border transition-all ${
                alert.read
                  ? 'bg-stone-50/70 border-stone-200 opacity-75'
                  : alert.severity === 'critical'
                  ? 'bg-red-50/70 border-red-200 ring-1 ring-red-400/20'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-white border-stone-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-white shadow-xs shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                        {alert.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          alert.severity === 'critical'
                            ? 'bg-red-200 text-red-900'
                            : alert.severity === 'warning'
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                      {alert.message}
                    </p>

                    <p className="text-[10px] text-stone-400 pt-1">
                      {new Date(alert.date).toLocaleDateString()} • Real-time Farm Sensor/Forecast
                    </p>
                  </div>
                </div>

                {!alert.read && (
                  <button
                    onClick={() => handleMarkRead(alert.id)}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 transition-colors"
                  >
                    {t('alertsPage.markRead')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center max-w-md mx-auto space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">All Clear</h3>
          <p className="text-xs text-stone-500">{t('alertsPage.noAlerts')}</p>
        </div>
      )}
    </div>
  );
};
