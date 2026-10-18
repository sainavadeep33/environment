import React, { useState } from 'react';
import {
  Leaf,
  Award,
  CheckCircle,
  Trophy,
  Gift,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenSubmitModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenSubmitModal,
}) => {
  const { currentUser, isAdmin, isStudent, logout, switchDemoUser } = useAuth();
  const { userBalance, activities } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const pendingCount = activities.filter((a) => a.status === 'pending').length;

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-emerald-950">
                  Green<span className="text-emerald-600">Cred</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                  Campus
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                Every Green Action Counts
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigateTo('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'landing'
                  ? 'text-emerald-800 bg-emerald-50'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>

            {currentUser && isStudent && (
              <>
                <button
                  onClick={() => navigateTo('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'text-emerald-800 bg-emerald-50 font-semibold'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo('activities')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentTab === 'activities'
                      ? 'text-emerald-800 bg-emerald-50 font-semibold'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  My Activities
                </button>
              </>
            )}

            {currentUser && isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === 'admin'
                    ? 'text-emerald-800 bg-emerald-50 font-bold'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Admin Hub
                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </span>
              </button>
            )}

            <button
              onClick={() => navigateTo('rewards')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'rewards'
                  ? 'text-emerald-800 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Rewards
            </button>

            <button
              onClick={() => navigateTo('challenges')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'challenges'
                  ? 'text-emerald-800 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Challenges
            </button>

            <button
              onClick={() => navigateTo('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'leaderboard'
                  ? 'text-emerald-800 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Leaderboard
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher for pair testing */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 pl-1.5 pr-0.5 text-[10px] font-medium uppercase tracking-wider flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3" />
                Role:
              </span>
              <button
                onClick={() => switchDemoUser('student')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  isStudent
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Demo Student (Alex Rivera)"
              >
                Student
              </button>
              <button
                onClick={() => switchDemoUser('admin')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  isAdmin
                    ? 'bg-emerald-950 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Demo Administrator (Dean Vance)"
              >
                Admin
                {pendingCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Credit balance display */}
                {isStudent && (
                  <div
                    onClick={() => navigateTo('rewards')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl cursor-pointer transition-colors shadow-xs"
                    title="Your verified Green Credits balance (derived from ledger)"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      GC
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-emerald-950 block leading-tight">
                        {userBalance}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block -mt-0.5">
                        Credits
                      </span>
                    </div>
                  </div>
                )}

                {/* Log Eco-Action CTA */}
                {isStudent && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onOpenSubmitModal}
                    icon={<PlusCircle className="w-4 h-4" />}
                    className="hidden sm:inline-flex"
                  >
                    Log Action
                  </Button>
                )}

                {/* Profile menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={
                        currentUser.avatar_url ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                          currentUser.full_name
                        )}`
                      }
                      alt={currentUser.full_name}
                      className="w-9 h-9 rounded-xl object-cover border-2 border-emerald-600/30"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {currentUser.full_name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant={isAdmin ? 'forest' : 'emerald'}
                            size="sm"
                          >
                            {isAdmin ? 'Administrator' : 'Student'}
                          </Badge>
                          <span className="text-[11px] text-slate-500 truncate">
                            {currentUser.college_name}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => navigateTo('profile')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Profile & Settings
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => navigateTo('admin')}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Admin Console
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            setProfileDropdownOpen(false);
                            await logout();
                            navigateTo('landing');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenAuth('login')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onOpenAuth('register')}
                >
                  Join GreenCred
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2">
          {/* Quick Demo Switcher on mobile */}
          <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl mb-3">
            <span className="text-xs font-semibold text-slate-600">Switch Persona:</span>
            <div className="flex gap-2">
              <button
                onClick={() => switchDemoUser('student')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer ${
                  isStudent ? 'bg-emerald-600 text-white font-bold' : 'bg-white text-slate-700'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => switchDemoUser('admin')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer ${
                  isAdmin ? 'bg-emerald-950 text-white font-bold' : 'bg-white text-slate-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <button
            onClick={() => navigateTo('landing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            Overview
          </button>

          {currentUser && isStudent && (
            <>
              <button
                onClick={() => navigateTo('dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50/60"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('activities')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
              >
                My Activities
              </button>
            </>
          )}

          {currentUser && isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50/60 flex items-center justify-between"
            >
              <span>Admin Hub</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500 text-white">
                  {pendingCount} pending
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => navigateTo('rewards')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            Rewards Catalog
          </button>

          <button
            onClick={() => navigateTo('challenges')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            Challenges
          </button>

          <button
            onClick={() => navigateTo('leaderboard')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            Leaderboard
          </button>

          {isStudent && (
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSubmitModal();
                }}
                icon={<PlusCircle className="w-4 h-4" />}
              >
                Log Eco-Action
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
