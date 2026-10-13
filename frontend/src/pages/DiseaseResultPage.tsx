import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  AlertTriangle,
  Beaker,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Info,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { VoiceReader } from '../components/common/VoiceReader.js';

export const DiseaseResultPage: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id');

  // Prevent stale results by tracking active ID and resetting on navigation
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    // If fresh state was passed via navigation, use it
    if (location.state?.analysis) {
      setAnalysis(location.state.analysis);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch by ID from database
    if (idFromUrl) {
      api.disease.getById(idFromUrl).then((res) => {
        if (res.success && res.analysis) {
          setAnalysis(res.analysis);
        } else {
          setAnalysis(null);
        }
      }).catch((err) => {
        console.warn('Error fetching disease record:', err);
        setAnalysis(null);
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [idFromUrl, location.key, location.state]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3 animate-in fade-in">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-stone-600 text-sm font-semibold">{t('common.loading')}</p>
        <p className="text-xs text-stone-400">Loading plant assessment...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-stone-600 text-sm">Diagnosis result not found or expired.</p>
        <Link
          to="/disease-detection"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
        >
          <Camera className="w-4 h-4" />
          <span>{t('diseaseResult.checkAnother')}</span>
        </Link>
      </div>
    );
  }

  const isDemo = analysis.providerUsed?.includes('SIMULATED DEMO RESULT');
  const isUnavailable = analysis.issue_type === 'analysis_unavailable' || analysis.confidence === 0;
  const isHealthy = analysis.issue_type === 'healthy' || analysis.possibleIssue?.toLowerCase().includes('healthy');

  const speechContent = isUnavailable
    ? (analysis.warning || 'AI analysis could not be completed.')
    : `${analysis.cropIdentified}. ${analysis.possibleIssue}. Organic solutions: ${(analysis.organicSolutions || []).join('. ')}.`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/disease-detection"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Detection</span>
        </Link>

        <VoiceReader textToRead={speechContent} />
      </div>

      {/* Demo Warning Banner if in Mock Mode */}
      {isDemo && (
        <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-between shadow-xs">
          <span>⚠️ SIMULATED DEMO RESULT (Mock Mode Active)</span>
          <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full uppercase">Demo Only</span>
        </div>
      )}

      {/* CASE 1: AI ANALYSIS UNAVAILABLE */}
      {isUnavailable ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              {analysis.possibleIssue || 'AI Analysis Unavailable'}
            </h1>
            <p className="text-stone-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
              {analysis.warning}
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left max-w-lg mx-auto space-y-2">
            <p className="text-xs font-bold text-stone-800 uppercase tracking-wide">
              {t('disease.instructionsTitle')}
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
              <li>{t('disease.tip1')}</li>
              <li>{t('disease.tip2')}</li>
              <li>{t('disease.tip3')}</li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              to="/disease-detection"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all hover:scale-102"
            >
              <Camera className="w-4 h-4" />
              <span>{t('diseaseResult.checkAnother')}</span>
            </Link>
          </div>
        </div>
      ) : (
        /* CASE 2: NORMAL DIAGNOSIS OR HEALTHY ASSESSMENT */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <Sprout className="w-3.5 h-3.5" />
                <span>{analysis.cropIdentified}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {analysis.possibleIssue}
              </h1>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>Provider: {analysis.providerUsed || 'AI Engine'} • {new Date(analysis.createdAt).toLocaleDateString()}</span>
              </p>
            </div>

            {/* Confidence & Severity Badges */}
            <div className="flex items-center gap-2 sm:self-start">
              <div className="bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200 text-right">
                <p className="text-[10px] text-stone-400 font-bold uppercase">{t('diseaseResult.confidence')}</p>
                <p className="text-lg font-black text-emerald-700">{analysis.confidence}%</p>
              </div>

              <div className="bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200 text-right">
                <p className="text-[10px] text-stone-400 font-bold uppercase">{t('diseaseResult.severity')}</p>
                <p className={`text-base font-extrabold capitalize ${
                  analysis.severity === 'high' ? 'text-red-600' : analysis.severity === 'medium' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {analysis.severity}
                </p>
              </div>
            </div>
          </div>

          {/* Symptoms Observed */}
          {analysis.symptoms && analysis.symptoms.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t('diseaseResult.symptoms')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.symptoms.map((symptom: string, idx: number) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200/80"
                  >
                    {symptom}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1: ORGANIC & BIOLOGICAL SOLUTIONS (MUST APPEAR FIRST!) */}
          <div className="bg-linear-to-br from-emerald-50 via-emerald-50/50 to-green-50/40 rounded-3xl p-6 border-2 border-emerald-300 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-emerald-950">
                  {isHealthy ? '🌱 Sustainable Crop Maintenance' : t('diseaseResult.organicHeader')}
                </h2>
                <p className="text-xs text-emerald-800 font-medium">
                  {t('diseaseResult.organicDesc')}
                </p>
              </div>
            </div>

            {/* Organic Solutions List */}
            <div className="space-y-2 pt-1">
              {(analysis.organicSolutions || []).map((sol: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 border border-emerald-200/80 text-xs sm:text-sm text-stone-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{sol}</span>
                </div>
              ))}
            </div>

            {/* Biological Solutions */}
            {analysis.biologicalSolutions && analysis.biologicalSolutions.length > 0 && (
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  {t('diseaseResult.bioHeader')}
                </h4>
                <div className="space-y-2">
                  {analysis.biologicalSolutions.map((bio: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-white/80 border border-emerald-100 text-xs sm:text-sm text-stone-800"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></div>
                      <span className="leading-relaxed font-medium">{bio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: VERIFIED TREATMENT OPTIONS */}
          {!isHealthy && analysis.additionalTreatment && analysis.additionalTreatment.length > 0 && (
            <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm sm:text-base font-bold text-amber-950">
                  {t('diseaseResult.treatmentHeader')}
                </h3>
              </div>

              <p className="text-[11px] text-amber-900 leading-relaxed font-medium bg-amber-100/60 p-3 rounded-xl border border-amber-200/60">
                {t('diseaseResult.treatmentDisclaimer')}
              </p>

              <div className="space-y-2 pt-1">
                {analysis.additionalTreatment.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white text-xs sm:text-sm text-stone-700 border border-amber-100"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: PREVENTION & CULTURAL PRACTICES */}
          {analysis.prevention && analysis.prevention.length > 0 && (
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-3">
              <h3 className="text-sm font-bold text-stone-900">
                {t('diseaseResult.preventionHeader')}
              </h3>
              <ul className="text-xs sm:text-sm text-stone-700 space-y-2">
                {analysis.prevention.map((prev: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{prev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer / Warning Footer */}
          <div className="p-4 rounded-2xl bg-stone-100 text-stone-600 text-xs leading-relaxed border border-stone-200">
            <p className="font-semibold text-stone-700 mb-0.5">⚠️ {t('diseaseResult.warningNote')}</p>
            <p>{analysis.warning}</p>
          </div>

          {/* Button to check another photo */}
          <div className="pt-2 flex justify-center">
            <Link
              to="/disease-detection"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <Camera className="w-4 h-4" />
              <span>{t('diseaseResult.checkAnother')}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
