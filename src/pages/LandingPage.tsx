import React, { useState } from 'react';
import {
  Leaf,
  Recycle,
  TreePine,
  Bike,
  ShieldCheck,
  Gift,
  Trophy,
  Award,
  ChevronDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Building2,
  Store,
  QrCode,
  BarChart3,
  Globe,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ContactSection } from '../components/landing/ContactSection';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onNavigate: (tab: string) => void;
  onOpenSubmitModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onNavigate,
  onOpenSubmitModal,
}) => {
  const { currentUser, isStudent, isAdmin } = useAuth();
  const { platformImpact, rules, rewards, challenges } = useApp();
  const [activeBenefitTab, setActiveBenefitTab] = useState<'students' | 'colleges' | 'partners'>('students');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How are Green Credits verified?',
      a: 'When a student logs an eco-action (such as depositing recyclables or commuting by bicycle), they provide notes and optional photo evidence. Campus sustainability administrators review these submissions in the verification queue. Only approved actions trigger immutable ledger credit transactions, preventing duplicate or unearned credits.',
    },
    {
      q: 'What rewards can students redeem?',
      a: 'GreenCred partners with campus dining halls, university bookstores, student unions, and local merchants. Rewards include reusable thermal tumblers, free coffee vouchers, bike-share passes, textbook discounts, and even native trees planted in the student’s name.',
    },
    {
      q: 'How do campus administrators manage platform rules?',
      a: 'Authorized college administrators have access to an administrative dashboard where they can configure credit values per activity, set estimated CO₂ offset rates, add and edit reward items, and launch campus-wide challenges.',
    },
    {
      q: 'Is my student account information public on the leaderboard?',
      a: 'No. GreenCred takes student privacy seriously. Only your chosen public eco-alias or first name is displayed on the campus leaderboard. Private contact details, passwords, and student IDs are strictly shielded by Row-Level Security policies.',
    },
    {
      q: 'How does GreenCred prevent fraudulent activity or balance tampering?',
      a: 'All credit awards and redemptions are processed through database-level stored procedures and recorded in an append-only ledger (`credit_transactions`). Balances are dynamically derived from this ledger, making client-side tampering impossible.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Every Green Action Counts</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Make Sustainability <span className="text-emerald-700">Rewarding</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                GreenCred turns campus eco-habits into tangible perks. Recycle waste, cycle to class, plant trees, and reduce single-use plastic to earn verified Green Credits redeemable at campus cafes, bookstores, and sustainable merchants.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                {currentUser ? (
                  isStudent ? (
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => onNavigate('dashboard')}
                      icon={<ArrowRight className="w-5 h-5" />}
                    >
                      Go to Student Dashboard
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={() => onNavigate('admin')}
                      icon={<ShieldCheck className="w-5 h-5" />}
                    >
                      Go to Admin Console
                    </Button>
                  )
                ) : (
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => onOpenAuth('register')}
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    Get Started Free
                  </Button>
                )}

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3.5 text-base transition-colors shadow-xs"
                >
                  Explore How It Works
                </a>

                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center font-medium rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 px-6 py-3.5 text-base transition-colors"
                >
                  Partner With Us
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Ledger-backed credit verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Campus voucher redemption</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Transparent CO₂ tracking</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic / Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 space-y-5">
                {/* Visual student card header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                      GC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Pacific Green University</div>
                      <div className="text-[11px] text-slate-500">Student Eco-Passport</div>
                    </div>
                  </div>
                  <Badge variant="emerald" size="sm">
                    Verified
                  </Badge>
                </div>

                {/* Ledger Balance Preview */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-emerald-900 text-white relative overflow-hidden shadow-lg">
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                      Current Green Balance
                    </span>
                    <div className="text-3xl font-black mt-1">
                      165 <span className="text-sm font-semibold text-emerald-200">Credits</span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-emerald-200/90">
                      <span>~24.8 kg CO₂ Diverted</span>
                      <span>•</span>
                      <span>1.1 Trees Equivalent</span>
                    </div>
                  </div>
                </div>

                {/* Recent Verified Activities Feed Snippet */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Live Verified Campus Actions
                  </span>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <Recycle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Plastic Waste Recycled</div>
                        <div className="text-[10px] text-slate-500">North Quad • 15 cans deposited</div>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-700">+15 GC</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <TreePine className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Sapling Care & Watering</div>
                        <div className="text-[10px] text-slate-500">Campus Arboretum</div>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-700">+50 GC</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="mint"
                  className="w-full text-xs font-semibold"
                  onClick={() => onNavigate('rewards')}
                >
                  Browse Campus Rewards Catalog &rarr;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION SECTION */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              The Campus Challenge
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Why Traditional Campus Greening Stalls & How GreenCred Fixes It
            </h3>
            <p className="text-sm text-slate-600">
              Colleges set ambitious net-zero targets, but lack student engagement mechanisms and verified proof of impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* The Problem */}
            <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-200/80 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                The Campus Dilemma
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Passive Awareness Doesn’t Change Daily Habits
              </h4>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Disposal Fatigue:</strong> Thousands of single-use coffee cups and takeout containers enter campus waste streams daily with zero incentive to reuse.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Unrecognized Student Efforts:</strong> Students who walk, cycle, or pick up litter have no record or institutional reward for their dedication.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Unverifiable ESG Reporting:</strong> Campus sustainability offices struggle to provide auditable student participation numbers for university rankings.</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                The GreenCred Solution
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Verified Micro-Incentives Backed by an Immutable Ledger
              </h4>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span><strong>Instant Gratification:</strong> Log photo evidence or scan station QR codes to earn Green Credits redeemable for real meals, passes, and bookstore perks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span><strong>Strict Verification Queue:</strong> Administrators review submissions before ledger allocation, preventing counterfeit credits and bot spam.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span><strong>Transparent Impact Calculation:</strong> Transparent CO₂ equivalent equations (EPA standards) give campuses real sustainability audit data.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Seamless 3-Step Loop
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              How GreenCred Works
            </h3>
            <p className="text-sm text-slate-600">
              From campus action to local rewards in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 relative shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl shadow-xs">
                1
              </div>
              <h4 className="font-bold text-lg text-slate-900">Take Action</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recycle segregated waste, commute via bicycle, participate in campus garden plantings, or join quad clean-up ploggings. Snap a quick photo or note.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700">
                5+ Activity Categories
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 relative shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl shadow-xs">
                2
              </div>
              <h4 className="font-bold text-lg text-slate-900">Earn Green Credits</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your submission is verified by campus administrators. Credits are atomically minted into your immutable ledger balance with calculated CO₂ savings.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700">
                Ledger-Backed Accuracy
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 relative shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl shadow-xs">
                3
              </div>
              <h4 className="font-bold text-lg text-slate-900">Redeem Rewards</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exchange your Green Credits for dining vouchers, eco-merch, transit passes, or dedicated campus tree dedications using unique digital voucher codes.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700">
                Campus Union & Merchant Perks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM FEATURES GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Comprehensive Platform
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Engineered for Real Campus Impact
            </h3>
            <p className="text-sm text-slate-600">
              Every feature is connected to real logic and database enforcement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Recycle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Recycling Challenges</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Targeted waste diversion drives with photo verification for plastics, cans, paper, and electronic e-waste.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <TreePine className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Tree Planting & Flora Care</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incentivize botanical quad restoration and sapling maintenance with GPS-verified green zone tagging.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Bike className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Sustainable Transit Tracking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reward zero-emission bicycle commutes, walking strides, and campus transit shuttle use over single-occupancy vehicles.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Admin Activity Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full review dashboard with photo inspector, adjustable credit weights, and constructive rejection reasons.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Atomic Rewards Redemption</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Server-side stored procedures guarantee real-time stock decrements and prevent duplicate claims or overdrafts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Privacy-First Leaderboards</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Campus leaderboards sorted solely by verified ledger transactions with protected student eco-aliases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS SECTION (SEGMENTED TABS) */}
      <section id="benefits" className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Value for Everyone
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Tailored Benefits Across Campus
            </h3>
          </div>

          {/* Segmented Tab Buttons */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs">
              <button
                onClick={() => setActiveBenefitTab('students')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeBenefitTab === 'students'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                For Students
              </button>
              <button
                onClick={() => setActiveBenefitTab('colleges')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeBenefitTab === 'colleges'
                    ? 'bg-emerald-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                For Colleges & Universities
              </button>
              <button
                onClick={() => setActiveBenefitTab('partners')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeBenefitTab === 'partners'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                For Business Partners
              </button>
            </div>
          </div>

          {/* Tab Content Cards */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            {activeBenefitTab === 'students' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="text-xl font-bold text-slate-900">
                  Empowering Students to Lead Climate Action
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Turn daily choices into real benefits. Whether you're filling a reusable mug, walking across campus, or helping clean the quad, you build a verified sustainability transcript that looks great on resumes and saves you money.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
                    <span className="font-bold text-emerald-950 block mb-0.5">Real Economic Perks</span>
                    <span className="text-slate-600">Discounts on textbook rentals, meal vouchers, and free campus transit passes.</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
                    <span className="font-bold text-emerald-950 block mb-0.5">Resume & Leadership Credentials</span>
                    <span className="text-slate-600">Export verified records of your carbon offsets and clean-up drive hours.</span>
                  </div>
                </div>
              </div>
            )}

            {activeBenefitTab === 'colleges' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="text-xl font-bold text-slate-900">
                  Accelerating Institutional Carbon Neutrality
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sustainability offices face immense pressure to meet climate goals. GreenCred provides the behavioral engagement engine and audit-ready data dashboards needed for AASHE STARS and campus accreditation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
                    <span className="font-bold text-emerald-950 block mb-0.5">AASHE STARS Reporting</span>
                    <span className="text-slate-600">Download auditable numbers on student waste diversion and eco-commute adoption.</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
                    <span className="font-bold text-emerald-950 block mb-0.5">Lower Municipal Waste Fees</span>
                    <span className="text-slate-600">Divert tons of plastic and organic waste from city dump surcharges.</span>
                  </div>
                </div>
              </div>
            )}

            {activeBenefitTab === 'partners' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="text-xl font-bold text-slate-900">
                  Targeted Student Foot Traffic for Eco-Friendly Merchants
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect your coffee shop, bicycle repair hub, or grocery co-op directly to campus members who value ethical and sustainable products.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
                    <span className="font-bold text-emerald-950 block mb-0.5">Zero-Risk Customer Acquisition</span>
                    <span className="text-slate-600">Sponsor reward vouchers and only pay upon in-store customer redemptions.</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
                    <span className="font-bold text-emerald-950 block mb-0.5">Local Brand Loyalty</span>
                    <span className="text-slate-600">Cement your business as a recognized campus sustainability champion.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT ENVIRONMENTAL IMPACT SECTION */}
      <section className="py-20 bg-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              Verified Campus Impact
            </div>
            <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
              Every Metric Derived from Proven Climate Formulas
            </h3>
            <p className="text-xs text-emerald-200/80 max-w-xl mx-auto leading-relaxed">
              GreenCred adheres to transparent scientific methodologies. The statistics below represent aggregate campus demonstration benchmarks until your campus records live activities.
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-emerald-800 text-center space-y-2 backdrop-blur-sm">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {platformImpact.total_co2_kg.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-300 block">
                kg CO₂ Avoided
              </span>
              <span className="text-[10px] text-emerald-300/70 block">
                Based on EPA commute & recycling data
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-emerald-800 text-center space-y-2 backdrop-blur-sm">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {platformImpact.trees_planted_equiv.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-300 block">
                Mature Trees Equivalent
              </span>
              <span className="text-[10px] text-emerald-300/70 block">
                21.77 kg CO₂/tree/year absorption rate
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-emerald-800 text-center space-y-2 backdrop-blur-sm">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {platformImpact.waste_diverted_kg.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-300 block">
                kg Waste Diverted
              </span>
              <span className="text-[10px] text-emerald-300/70 block">
                From campus quad landfill streams
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-emerald-800 text-center space-y-2 backdrop-blur-sm">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {platformImpact.green_actions_total.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-300 block">
                Verified Student Actions
              </span>
              <span className="text-[10px] text-emerald-300/70 block">
                Approved by campus staff
              </span>
            </div>
          </div>

          {/* Transparency Disclaimer Tag */}
          <div className="mt-8 p-4 rounded-xl bg-emerald-900/40 border border-emerald-800 text-center max-w-2xl mx-auto flex items-start gap-2.5 text-xs text-emerald-200/90">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-left text-[11px] leading-relaxed">
              <strong>Methodology Disclosure:</strong> {platformImpact.calculation_method}
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Questions & Answers
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT FORM SECTION */}
      <ContactSection />
    </div>
  );
};
