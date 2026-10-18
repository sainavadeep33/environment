import React, { useState } from 'react';
import { Trophy, Medal, Shield, Award, Users, Search, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';

export const LeaderboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { leaderboard } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeaderboard = leaderboard.filter(
    (entry) =>
      entry.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.college_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Campus Sustainability Leaderboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rankings are computed dynamically from approved ledger credits. Private student credentials are FERPA-shielded.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Ledger-verified credits only</span>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
          {/* Silver #2 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 order-2 md:order-1 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center relative">
              <img
                src={topThree[1].avatar_url}
                alt={topThree[1].display_name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                2
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{topThree[1].display_name}</h4>
              <p className="text-[11px] text-slate-500">{topThree[1].college_name}</p>
            </div>
            <div className="text-xl font-black text-slate-700">
              {topThree[1].total_credits} <span className="text-xs font-semibold">Credits</span>
            </div>
            <Badge variant="slate" size="sm">
              {topThree[1].approved_activities_count} Verified Actions
            </Badge>
          </div>

          {/* Gold #1 (Raised / Featured) */}
          <div className="bg-gradient-to-b from-amber-50/80 to-white rounded-3xl border-2 border-amber-300 p-8 text-center space-y-4 order-1 md:order-2 shadow-lg relative -mt-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-sm">
                <Trophy className="w-3.5 h-3.5" /> Campus Champion
              </span>
            </div>

            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center relative ring-4 ring-amber-300/50">
              <img
                src={topThree[0].avatar_url}
                alt={topThree[0].display_name}
                className="w-18 h-18 rounded-full object-cover"
              />
              <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                1
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900">{topThree[0].display_name}</h4>
              <p className="text-xs text-slate-500">{topThree[0].college_name}</p>
            </div>
            <div className="text-3xl font-black text-amber-900">
              {topThree[0].total_credits} <span className="text-sm font-semibold">Credits</span>
            </div>
            <Badge variant="amber" size="sm">
              {topThree[0].approved_activities_count} Verified Actions
            </Badge>
          </div>

          {/* Bronze #3 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 order-3 md:order-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center relative">
              <img
                src={topThree[2].avatar_url}
                alt={topThree[2].display_name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                3
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{topThree[2].display_name}</h4>
              <p className="text-[11px] text-slate-500">{topThree[2].college_name}</p>
            </div>
            <div className="text-xl font-black text-amber-800">
              {topThree[2].total_credits} <span className="text-xs font-semibold">Credits</span>
            </div>
            <Badge variant="mint" size="sm">
              {topThree[2].approved_activities_count} Verified Actions
            </Badge>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Full Campus Standings</h3>
            <p className="text-xs text-slate-400">All registered students ranked by total verified Green Credits.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or college..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Rank</th>
                <th className="px-6 py-3.5">Student / Public Alias</th>
                <th className="px-6 py-3.5">College</th>
                <th className="px-6 py-3.5">Approved Actions</th>
                <th className="px-6 py-3.5 text-right">Verified Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaderboard.map((entry) => {
                const isCurrent = entry.user_id === currentUser?.id;
                return (
                  <tr
                    key={entry.user_id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-emerald-50/70 font-semibold text-emerald-950'
                        : 'hover:bg-slate-50/60 text-slate-700'
                    }`}
                  >
                    <td className="px-6 py-4 font-black">
                      {entry.rank === 1 ? (
                        <span className="text-amber-500 font-extrabold text-sm">🥇 #1</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-slate-400 font-extrabold text-sm">🥈 #2</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-amber-700 font-extrabold text-sm">🥉 #3</span>
                      ) : (
                        `#${entry.rank}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatar_url}
                          alt={entry.display_name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {entry.display_name}
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-emerald-200 text-emerald-900">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">FERPA-Shielded</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{entry.college_name}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{entry.approved_activities_count}</span> actions
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-base text-emerald-700">
                        {entry.total_credits}
                      </span>{' '}
                      <span className="text-[11px] font-semibold text-slate-500">GC</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
