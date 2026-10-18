import React from 'react';
import { Leaf, Heart, Shield, FileText, Mail, Globe, MapPin, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-emerald-950 text-slate-300 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md">
                <Leaf className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Green<span className="text-emerald-400">Cred</span>
              </span>
            </div>

            <p className="text-emerald-200/80 text-sm font-medium">
              Every Green Action Counts.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering college campuses worldwide to eliminate single-use plastics, reduce emissions, restore native flora, and incentivize student eco-stewardship through verified, ledger-backed Green Credits.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400/90 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Built for higher education sustainability programs.</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Overview & Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rewards')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Rewards Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('challenges')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Campus Challenges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('leaderboard')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Campus Leaderboard
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions & Stakeholders */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#benefits" className="hover:text-emerald-400 transition-colors">
                  For University Students
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-emerald-400 transition-colors">
                  For Sustainability Offices
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-emerald-400 transition-colors">
                  For Campus Merchants
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  Verification & Ledger Proof
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Integrations & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Row-Level Security (RLS)
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Immutable Credit Ledger
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">
                  Contact Campus Operations
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} GreenCred. All rights reserved. Every Green Action Counts.
          </p>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">
              Privacy Policy (Campus FERPA compliant)
            </span>
            <span className="hover:text-slate-300 cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-slate-300 cursor-pointer">
              Platform Rules
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
