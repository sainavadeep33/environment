export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  college_name: string;
  role: UserRole;
  avatar_url?: string;
  public_alias?: string;
  show_on_leaderboard?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ActivityType =
  | 'recycling'
  | 'tree_planting'
  | 'sustainable_transport'
  | 'plastic_reduction'
  | 'campus_cleanup';

export interface ActivityCreditRule {
  id: string;
  activity_type: ActivityType | string;
  title: string;
  description: string;
  default_credits: number;
  co2_savings_kg: number;
  icon: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ActivityStatus = 'pending' | 'approved' | 'rejected';

export interface Activity {
  id: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  activity_type: string;
  activity_title?: string;
  description: string;
  date: string;
  evidence_url?: string;
  status: ActivityStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_by_name?: string;
  reviewed_at?: string;
  credits_awarded: number;
  created_at: string;
}

export type TransactionType =
  | 'activity_award'
  | 'reward_redemption'
  | 'challenge_bonus'
  | 'admin_adjustment';

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number; // positive for awards, negative for redemptions
  transaction_type: TransactionType;
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  credit_cost: number;
  initial_stock: number;
  available_stock: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type RedemptionStatus = 'redeemed' | 'collected' | 'cancelled';

export interface Redemption {
  id: string;
  reward_id: string;
  reward_title?: string;
  reward_image?: string;
  user_id: string;
  credits_spent: number;
  redemption_code: string;
  status: RedemptionStatus;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  target_count: number;
  credit_reward: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at?: string;
}

export interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  user_id: string;
  current_progress: number;
  completed: boolean;
  completed_at?: string;
  joined_at: string;
  challenge?: Challenge;
}

export type MessageStatus = 'unread' | 'read' | 'responded';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  organization?: string;
  enquiry_type: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  college_name: string;
  total_credits: number;
  approved_activities_count: number;
  rank: number;
  avatar_url?: string;
}

export interface EnvironmentalImpactMetrics {
  total_co2_kg: number;
  trees_planted_equiv: number;
  waste_diverted_kg: number;
  green_actions_total: number;
  is_demo_data: boolean;
  calculation_method: string;
}
