import React from 'react';
import { Trophy, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ChallengeCard } from '../components/challenges/ChallengeCard';

export const ChallengesPage: React.FC = () => {
  const { currentUser, isStudent } = useAuth();
  const { challenges, participations, joinChallenge } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-emerald-600" />
          Campus Sustainability Challenges
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Join time-limited campus campaigns. Reach target activity milestones and earn bonus Green Credits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const part = participations.find(
            (p) => p.challenge_id === challenge.id && p.user_id === currentUser?.id
          );
          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              participation={part}
              onJoin={joinChallenge}
              isStudent={isStudent}
            />
          );
        })}
      </div>
    </div>
  );
};
