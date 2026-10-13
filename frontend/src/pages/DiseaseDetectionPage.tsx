import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  X,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';

export const DiseaseDetectionPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api.disease.getHistory().then((res) => {
      if (res.success) {
        setHistory(res.history || []);
      }
    }).catch(console.warn);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file (JPG, PNG, or WEBP).');
        return;
      }

      // Safe metadata logging (no API keys, no raw bytes)
      console.log('[DISEASE FRONTEND DEBUG] Image captured:', {
        filename: file.name,
        mimeType: file.type,
        fileSizeBytes: file.size
      });

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !previewUrl) {
      setErrorMessage('Please select or capture a leaf photo first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
        console.log('[DISEASE FRONTEND DEBUG] Sending FormData with actual image bytes:', {
          filename: selectedFile.name,
          mimeType: selectedFile.type,
          fileSizeBytes: selectedFile.size
        });
      }
      if (cropHint) {
        formData.append('cropHint', cropHint);
      }
      formData.append('language', language);

      const res = await api.disease.analyze(formData);

      if (res.success && res.analysis) {
        // Navigate with unique state, completely replacing any stale result
        navigate(`/disease-result?id=${res.analysis.id}`, {
          replace: true,
          state: {
            analysis: res.analysis,
            providerUsed: res.providerUsed,
            timestamp: Date.now()
          }
        });
      } else {
        setErrorMessage(res.message || 'Analysis could not be completed. Please try again with a clearer photo.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with analysis service.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      {/* Page Title */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {t('disease.title')}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {t('disease.subtitle')}
        </p>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
      />

      {/* Upload & Capture Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        {!previewUrl ? (
          <div className="border-2 border-dashed border-stone-300 rounded-3xl p-8 text-center bg-stone-50/60 hover:bg-stone-50 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>

            <h3 className="font-bold text-stone-800 text-base mb-1">
              {t('disease.uploadImage')}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              {language === 'mr'
                ? 'पानाचा, फळाचा किंवा झाडाचा स्पष्ट फोटो निवडा'
                : language === 'hi'
                ? 'पत्ती, फल या पौधे का स्पष्ट फोटो चुनें'
                : 'Select or take a high-resolution photo of the affected plant part'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <Camera className="w-4 h-4" />
                <span>{t('disease.takePhoto')}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>{t('disease.uploadImage')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 max-h-96 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Selected crop preview"
                className="max-h-96 w-auto object-contain rounded-2xl"
              />
              <button
                onClick={handleClearImage}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suspected Crop selector */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t('disease.selectCropOptional')}
              </label>
              <select
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">{t('disease.chooseCrop')}</option>
                <option value="Tomato">Tomato (टोमॅटो / टमाटर)</option>
                <option value="Cotton">Cotton (कापूस / कपास)</option>
                <option value="Chilli">Chilli (मिरची / मिर्च)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Onion">Onion (कांदा / प्याज)</option>
                <option value="Wheat">Wheat (गहू / गेहूं)</option>
              </select>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 text-red-800 text-xs border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('disease.analyzing')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{t('disease.analyzeButton')}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Photo Guidelines */}
        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>{t('disease.instructionsTitle')}</span>
          </div>
          <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
            <li>{t('disease.tip1')}</li>
            <li>{t('disease.tip2')}</li>
            <li>{t('disease.tip3')}</li>
          </ul>
        </div>
      </div>

      {/* Recent Diagnoses History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3>{t('disease.recentAnalyses')}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                to={`/disease-result?id=${item.id}`}
                className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-stone-900 text-sm">{item.possibleIssue}</p>
                  <p className="text-xs text-stone-500">{item.cropIdentified} • {item.confidence}% AI confidence</p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
