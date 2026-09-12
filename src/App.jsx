import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { GameProvider } from './context/GameContext';
import ToastContainer from './components/ui/ToastContainer';
import LevelUpModal from './components/gamification/LevelUpModal';

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const QuestsPage = lazy(() => import('./pages/QuestsPage'));
const CharacterPage = lazy(() => import('./pages/CharacterPage'));
const LootVaultPage = lazy(() => import('./pages/LootVaultPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <div className="min-h-screen bg-surface-dark bg-grid-pattern">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/character" element={<CharacterPage />} />
              <Route path="/loot-vault" element={<LootVaultPage />} />
            </Routes>
          </Suspense>
          <ToastContainer />
          <LevelUpModal />
        </div>
      </GameProvider>
    </BrowserRouter>
  );
}
