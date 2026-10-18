import React from 'react';
import { PlusCircle, Activity as ActivityIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ActivityList } from '../components/activities/ActivityList';
import { Button } from '../components/common/Button';

interface ActivitiesPageProps {
  onOpenSubmitModal: () => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ onOpenSubmitModal }) => {
  const { currentUser, isStudent } = useAuth();
  const { activities } = useApp();

  const userActivities = activities.filter((a) => a.student_id === currentUser?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-emerald-600" />
            My Sustainability Activities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and review your submitted campus eco-actions, evidence photos, and Green Credit awards.
          </p>
        </div>

        {isStudent && (
          <Button
            size="md"
            variant="primary"
            onClick={onOpenSubmitModal}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Log New Action
          </Button>
        )}
      </div>

      <ActivityList activities={userActivities} />
    </div>
  );
};
