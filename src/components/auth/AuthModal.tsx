import React, { useState } from 'react';
import { Mail, Lock, User, School, KeyRound, ShieldAlert, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const { login, register, resetPassword, switchDemoUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('Pacific Green University');
  const [role, setRole] = useState<UserRole>('student');
  const [adminCode, setAdminCode] = useState('');

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleTabSwitch = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
          if (onSuccess) onSuccess();
        } else {
          setErrorMsg(res.error || 'Login failed. Please check your credentials.');
        }
      } else if (mode === 'register') {
        const res = await register({
          email,
          password,
          fullName,
          collegeName,
          role,
          adminCode: role === 'admin' ? adminCode : undefined,
        });
        if (res.success) {
          setSuccessMsg('Account created successfully! Welcome to GreenCred.');
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 1200);
        } else {
          setErrorMsg(res.error || 'Registration failed.');
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMsg(res.message || 'Password reset link sent to your email.');
        } else {
          setErrorMsg(res.error || 'Failed to send reset link.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = async (demoRole: UserRole) => {
    switchDemoUser(demoRole);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Sign In to GreenCred'
          : mode === 'register'
          ? 'Create Your Campus Account'
          : 'Reset Your Password'
      }
      description={
        mode === 'login'
          ? 'Access your green credits, activities, and campus rewards.'
          : mode === 'register'
          ? 'Join your university community and start earning credits for every eco-action.'
          : 'Enter your verified campus email to receive a secure recovery link.'
      }
      maxWidth="md"
    >
      {/* Tab Switcher */}
      {mode !== 'forgot' && (
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
        </div>
      )}

      {/* Alert Messages */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'register' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University Name *
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Pacific Green University"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    role === 'student'
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'border-emerald-900 bg-emerald-950 text-white shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  College Administrator
                </button>
              </div>
            </div>

            {role === 'admin' && (
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs">
                <label className="block font-semibold text-amber-950 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  Administrator Authorization Code *
                </label>
                <input
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter campus admin key (Default: GREEN_ADMIN_2026)"
                  className="w-full text-xs px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                />
                <p className="text-[11px] text-amber-800 mt-1">
                  Required for security: Students cannot register as administrators without campus authorization.
                </p>
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Campus Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campus.edu"
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {mode !== 'forgot' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password *
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => handleTabSwitch('forgot')}
                  className="text-[11px] text-emerald-700 hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            {mode === 'register' && (
              <p className="text-[11px] text-slate-500 mt-1">
                Must be at least 6 characters. Passwords are never stored in plain text.
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full mt-2"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {mode === 'login'
            ? 'Sign In to Dashboard'
            : mode === 'register'
            ? 'Create Free Account'
            : 'Send Recovery Email'}
        </Button>
      </form>

      {mode === 'forgot' && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className="text-xs text-slate-600 hover:text-emerald-800 font-medium cursor-pointer"
          >
            &larr; Back to Sign In
          </button>
        </div>
      )}

      {/* Instant Demo Shortcut Buttons */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-[11px] text-slate-500 text-center font-medium mb-2.5">
          Or test instantly with pre-configured demo personas:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoQuickLogin('student')}
            className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-emerald-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Alex Rivera
            </div>
            <p className="text-[10px] text-slate-500">Student • 65 Credits</p>
          </button>

          <button
            type="button"
            onClick={() => handleDemoQuickLogin('admin')}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
              Dean Eleanor Vance
            </div>
            <p className="text-[10px] text-slate-500">Administrator • Approvals</p>
          </button>
        </div>
      </div>
    </Modal>
  );
};
