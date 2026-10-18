import React from 'react';
import { Trophy, Calendar, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Challenge, ChallengeParticipation } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ChallengeCardProps {
  challenge: Challenge;
  participation?: ChallengeParticipation;
  onJoin: (challengeId: string) => void;
  isStudent: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  participation,
  onJoin,
  isStudent,
}) => {
  const isJoined = Boolean(participation);
  const isCompleted = participation?.completed;
  const progress = participation?.current_progress || 0;
  const progressPercent = Math.min(
    100,
    Math.round((progress / challenge.target_count) * 100)
  );

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(challenge.end_date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="mint" size="sm">
              +{challenge.credit_reward} Bonus Credits
            </Badge>
            {isCompleted && (
              <Badge variant="emerald" size="sm" icon={<CheckCircle className="w-3 h-3" />}>
                Completed
              </Badge>
            )}
          </div>
        </div>

        <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
          {challenge.title}
        </h3>

        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
          {challenge.description}
        </p>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {daysLeft > 0 ? `${daysLeft} days remaining` : 'Challenge concluded'}
          </span>
          <span>•</span>
          <span>Target: {challenge.target_count} actions</span>
        </div>

        {/* Progress Bar if joined */}
        {isJoined && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Your Progress</span>
              <span className="text-emerald-800">
                {progress} / {challenge.target_count} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Target Action: <strong className="text-slate-700 capitalize">{challenge.activity_type.replace('_', ' ')}</strong>
        </span>

        <div>
          {isStudent ? (
            isJoined ? (
              isCompleted ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Bonus Claimed!
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-500">
                  Participating
                </span>
              )
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onJoin(challenge.id)}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Join Challenge
              </Button>
            )
          ) : (
            <span className="text-xs text-slate-400">Student login to participate</span>
          )}
        </div>
      </div>
    </div>
  );
};
