import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, KeyRound, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [resetToken, setResetToken] = useState('KRISHI2026');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.auth.forgotPassword(emailOrPhone);
      if (res.success) {
        setMessage(res.message);
        if (res.demoToken) setResetToken(res.demoToken);
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.auth.resetPassword({
        emailOrPhone,
        resetToken,
        newPassword
      });
      if (res.success) {
        alert(res.message);
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-5">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>

        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {t('auth.resetTitle')}
          </h1>
          <p className="text-xs text-stone-500">
            {t('auth.resetSubtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 text-red-800 text-xs border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-4 text-xs">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
            >
              {isLoading ? 'Verifying...' : 'Send Reset Instructions'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <p className="text-stone-500 leading-relaxed">
              {t('auth.resetInstructions')}
            </p>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('auth.resetToken')}</label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="KRISHI2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">{t('auth.newPassword')}</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
            >
              {isLoading ? 'Updating...' : t('auth.confirmReset')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
