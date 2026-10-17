import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { FarmProvider } from './context/FarmContext.js';
import { Header } from './components/layout/Header.js';
import { Navbar } from './components/layout/Navbar.js';
import { MobileNav } from './components/layout/MobileNav.js';

// Pages
import { DashboardPage } from './pages/DashboardPage.js';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage.js';
import { DiseaseResultPage } from './pages/DiseaseResultPage.js';
import { WeatherPage } from './pages/WeatherPage.js';
import { IrrigationPage } from './pages/IrrigationPage.js';
import { AiAssistantPage } from './pages/AiAssistantPage.js';
import { CropsPage } from './pages/CropsPage.js';
import { CropDetailPage } from './pages/CropDetailPage.js';
import { AlertsPage } from './pages/AlertsPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.js';
import { OnboardingPage } from './pages/OnboardingPage.js';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideNav = ['/login', '/register', '/forgot-password', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 font-sans selection:bg-emerald-200">
      <Header />
      {!hideNav && <Navbar />}

      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-20 lg:pb-12">
        {children}
      </main>

      {!hideNav && <MobileNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <FarmProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
                <Route path="/disease-result" element={<DiseaseResultPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/irrigation" element={<IrrigationPage />} />
                <Route path="/ai-assistant" element={<AiAssistantPage />} />
                <Route path="/crops" element={<CropsPage />} />
                <Route path="/crops/:id" element={<CropDetailPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          </FarmProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
