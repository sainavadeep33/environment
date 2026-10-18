import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SupabaseSetupBanner } from './components/common/SupabaseSetupBanner';
import { AuthModal } from './components/auth/AuthModal';
import { ActivitySubmitModal } from './components/activities/ActivitySubmitModal';
import { RedemptionModal } from './components/rewards/RedemptionModal';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { RewardsPage } from './pages/RewardsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Reward } from './types';

const AppContent: React.FC = () => {
  const { currentUser, isStudent, isAdmin } = useAuth();
  const { userBalance } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeRedeemReward, setActiveRedeemReward] = useState<Reward | null>(null);

  // Sync tab with URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (['landing', 'dashboard', 'activities', 'rewards', 'challenges', 'leaderboard', 'profile', 'admin'].includes(hash)) {
        setCurrentTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Supabase Setup & Connection Banner */}
      <SupabaseSetupBanner />

      {/* Main Responsive Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onOpenSubmitModal={() => setSubmitModalOpen(true)}
      />

      {/* Active Page Route View */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onNavigate={handleNavigate}
            onOpenSubmitModal={() => setSubmitModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <StudentDashboardPage
            onOpenSubmitModal={() => setSubmitModalOpen(true)}
            onNavigate={handleNavigate}
            onRedeemClick={(reward) => setActiveRedeemReward(reward)}
          />
        )}

        {currentTab === 'activities' && (
          <ActivitiesPage
            onOpenSubmitModal={() => setSubmitModalOpen(true)}
          />
        )}

        {currentTab === 'rewards' && <RewardsPage />}

        {currentTab === 'challenges' && <ChallengesPage />}

        {currentTab === 'leaderboard' && <LeaderboardPage />}

        {currentTab === 'profile' && <ProfilePage />}

        {currentTab === 'admin' && <AdminDashboardPage />}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          if (currentUser && currentUser.role === 'admin') {
            handleNavigate('admin');
          } else {
            handleNavigate('dashboard');
          }
        }}
      />

      <ActivitySubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSuccess={() => {
          handleNavigate('activities');
        }}
      />

      {activeRedeemReward && (
        <RedemptionModal
          reward={activeRedeemReward}
          isOpen={Boolean(activeRedeemReward)}
          onClose={() => setActiveRedeemReward(null)}
          userBalance={userBalance}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
