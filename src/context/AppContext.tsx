import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Activity,
  ActivityCreditRule,
  CreditTransaction,
  Reward,
  Redemption,
  Challenge,
  ChallengeParticipation,
  ContactMessage,
  LeaderboardEntry,
  EnvironmentalImpactMetrics,
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface AppContextType {
  rules: ActivityCreditRule[];
  activities: Activity[];
  transactions: CreditTransaction[];
  rewards: Reward[];
  redemptions: Redemption[];
  challenges: Challenge[];
  participations: ChallengeParticipation[];
  contactMessages: ContactMessage[];
  loading: boolean;
  
  // Computed values
  userBalance: number;
  userApprovedActivitiesCount: number;
  userTotalCO2SavedKg: number;
  userTreesEquivalent: number;
  leaderboard: LeaderboardEntry[];
  platformImpact: EnvironmentalImpactMetrics;

  // Actions
  submitActivity: (data: {
    activity_type: string;
    description: string;
    date: string;
    evidence_url?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  
  approveActivity: (
    activityId: string,
    creditsToAward?: number
  ) => Promise<{ success: boolean; error?: string }>;
  
  rejectActivity: (
    activityId: string,
    reason: string
  ) => Promise<{ success: boolean; error?: string }>;

  updateCreditRule: (
    ruleId: string,
    updates: Partial<ActivityCreditRule>
  ) => Promise<{ success: boolean; error?: string }>;

  createReward: (
    reward: Omit<Reward, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<{ success: boolean; error?: string }>;

  updateReward: (
    rewardId: string,
    updates: Partial<Reward>
  ) => Promise<{ success: boolean; error?: string }>;

  redeemReward: (
    rewardId: string
  ) => Promise<{ success: boolean; error?: string; redemptionCode?: string }>;

  createChallenge: (
    challenge: Omit<Challenge, 'id' | 'created_at'>
  ) => Promise<{ success: boolean; error?: string }>;

  joinChallenge: (
    challengeId: string
  ) => Promise<{ success: boolean; error?: string }>;

  submitContactMessage: (
    message: Omit<ContactMessage, 'id' | 'status' | 'created_at'>
  ) => Promise<{ success: boolean; error?: string }>;

  updateMessageStatus: (
    messageId: string,
    status: ContactMessage['status']
  ) => Promise<{ success: boolean; error?: string }>;

  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Seed Rules
const DEFAULT_RULES: ActivityCreditRule[] = [
  {
    id: 'rule_1',
    activity_type: 'recycling',
    title: 'Recycling & Segregated Waste',
    description: 'Deposit plastic, aluminum, or electronic waste at campus recycling stations.',
    default_credits: 15,
    co2_savings_kg: 2.4,
    icon: 'recycle',
    is_active: true,
  },
  {
    id: 'rule_2',
    activity_type: 'tree_planting',
    title: 'Tree Planting & Sapling Care',
    description: 'Plant or care for saplings in campus green zones and botanical areas.',
    default_credits: 50,
    co2_savings_kg: 15.0,
    icon: 'tree-pine',
    is_active: true,
  },
  {
    id: 'rule_3',
    activity_type: 'sustainable_transport',
    title: 'Sustainable Transport / Cycling',
    description: 'Commute to campus via bicycle, zero-emission bus, or walking.',
    default_credits: 20,
    co2_savings_kg: 3.8,
    icon: 'bike',
    is_active: true,
  },
  {
    id: 'rule_4',
    activity_type: 'plastic_reduction',
    title: 'Single-Use Plastic Reduction',
    description: 'Use reusable mugs, bottles, or food boxes for five consecutive meals.',
    default_credits: 25,
    co2_savings_kg: 1.9,
    icon: 'shield-check',
    is_active: true,
  },
  {
    id: 'rule_5',
    activity_type: 'campus_cleanup',
    title: 'Campus Clean-Up Drive',
    description: 'Join organized student clean-up drives, litter pickups, and quad restoration.',
    default_credits: 40,
    co2_savings_kg: 8.5,
    icon: 'sparkles',
    is_active: true,
  },
];

// Initial Seed Rewards
const DEFAULT_REWARDS: Reward[] = [
  {
    id: 'rew_1',
    title: 'Campus Eco-Thermal Tumbler',
    description: 'Double-wall insulated stainless steel 500ml flask. Keeps hot coffee warm for 12 hours.',
    category: 'Merchandise',
    image_url: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80',
    credit_cost: 120,
    initial_stock: 50,
    available_stock: 46,
    is_active: true,
  },
  {
    id: 'rew_2',
    title: 'Campus Cafeteria $10 Meal Voucher',
    description: 'Valid for healthy salads, vegan wraps, and fresh meals at any campus dining hall.',
    category: 'Dining',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    credit_cost: 80,
    initial_stock: 100,
    available_stock: 82,
    is_active: true,
  },
  {
    id: 'rew_3',
    title: 'Tree Planted in Your Name Certificate',
    description: 'A native tree planted in the university botanical sanctuary with your name tagged and tracked.',
    category: 'Recognition',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    credit_cost: 150,
    initial_stock: 200,
    available_stock: 194,
    is_active: true,
  },
  {
    id: 'rew_4',
    title: 'Campus Bike Share 1-Month Pass',
    description: 'Unlimited free 60-minute rentals across all campus bike-sharing docking stations.',
    category: 'Transit',
    image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    credit_cost: 100,
    initial_stock: 60,
    available_stock: 55,
    is_active: true,
  },
  {
    id: 'rew_5',
    title: 'Zero-Waste Bamboo Cutlery & Straw Kit',
    description: 'Portable organic bamboo fork, spoon, knife, chopsticks, and cleaner in a washable linen pouch.',
    category: 'Merchandise',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    credit_cost: 60,
    initial_stock: 75,
    available_stock: 68,
    is_active: true,
  },
  {
    id: 'rew_6',
    title: 'University Bookstore $15 Textbook Credit',
    description: 'Apply $15 discount towards any certified recycled paper notebook or second-hand textbook.',
    category: 'Academic',
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    credit_cost: 140,
    initial_stock: 40,
    available_stock: 31,
    is_active: true,
  },
];

// Initial Seed Challenges
const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'chal_1',
    title: 'Plastic-Free Quad Challenge',
    description: 'Log 5 single-use plastic reduction actions this month to eliminate disposable plastics from student dining.',
    activity_type: 'plastic_reduction',
    target_count: 5,
    credit_reward: 60,
    start_date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString().split('T')[0],
    is_active: true,
  },
  {
    id: 'chal_2',
    title: 'Spring Campus Reforestation',
    description: 'Participate in planting or nurturing 3 trees or campus garden saplings during the greening festival.',
    activity_type: 'tree_planting',
    target_count: 3,
    credit_reward: 100,
    start_date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 40 * 24 * 3600 * 1000).toISOString().split('T')[0],
    is_active: true,
  },
  {
    id: 'chal_3',
    title: 'Pedal & Stride: Low Carbon Commute',
    description: 'Log 8 sustainable cycling or walking commutes to earn the campus eco-traveler crest.',
    activity_type: 'sustainable_transport',
    target_count: 8,
    credit_reward: 80,
    start_date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString().split('T')[0],
    is_active: true,
  },
];

// Initial Sample Activities for demo richness
const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'act_demo_1',
    student_id: 'usr_student_01',
    student_name: 'Alex Rivera',
    student_email: 'alex.rivera@campus.edu',
    activity_type: 'recycling',
    activity_title: 'Recycling & Segregated Waste',
    description: 'Sorted 20 PET plastic beverage bottles and deposited them at North Quad Bin #4.',
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    evidence_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    reviewed_by: 'usr_admin_01',
    reviewed_by_name: 'Dean Eleanor Vance',
    reviewed_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    credits_awarded: 15,
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act_demo_2',
    student_id: 'usr_student_01',
    student_name: 'Alex Rivera',
    student_email: 'alex.rivera@campus.edu',
    activity_type: 'tree_planting',
    activity_title: 'Tree Planting & Sapling Care',
    description: 'Planted an oak sapling along the south science pathway with Earth Club volunteers.',
    date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
    evidence_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    reviewed_by: 'usr_admin_01',
    reviewed_by_name: 'Dean Eleanor Vance',
    reviewed_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    credits_awarded: 50,
    created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act_demo_3',
    student_id: 'usr_student_02',
    student_name: 'Marcus Chen',
    student_email: 'marcus.c@campus.edu',
    activity_type: 'sustainable_transport',
    activity_title: 'Sustainable Transport / Cycling',
    description: 'Cycled 6.2 miles from off-campus housing to Main Library instead of taking car.',
    date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
    evidence_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    credits_awarded: 0,
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'act_demo_4',
    student_id: 'usr_student_03',
    student_name: 'Priya Sharma',
    student_email: 'priya.s@campus.edu',
    activity_type: 'campus_cleanup',
    activity_title: 'Campus Clean-Up Drive',
    description: 'Joined Saturday morning athletic grounds litter-collection shift.',
    date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    evidence_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    credits_awarded: 0,
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
];

// Initial Transactions (Ledger)
const DEFAULT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'tx_1',
    user_id: 'usr_student_01',
    amount: 15,
    transaction_type: 'activity_award',
    reference_id: 'act_demo_1',
    description: 'Credits awarded for verified activity: Recycling & Segregated Waste',
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tx_2',
    user_id: 'usr_student_01',
    amount: 50,
    transaction_type: 'activity_award',
    reference_id: 'act_demo_2',
    description: 'Credits awarded for verified activity: Tree Planting & Sapling Care',
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tx_3',
    user_id: 'usr_student_02',
    amount: 140,
    transaction_type: 'activity_award',
    description: 'Legacy verified activities balance',
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tx_4',
    user_id: 'usr_student_03',
    amount: 95,
    transaction_type: 'activity_award',
    description: 'Legacy verified activities balance',
    created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  // States
  const [rules, setRules] = useState<ActivityCreditRule[]>(() => {
    const saved = localStorage.getItem('greencred_rules');
    return saved ? JSON.parse(saved) : DEFAULT_RULES;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('greencred_activities');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
  });

  const [transactions, setTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem('greencred_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('greencred_rewards');
    return saved ? JSON.parse(saved) : DEFAULT_REWARDS;
  });

  const [redemptions, setRedemptions] = useState<Redemption[]>(() => {
    const saved = localStorage.getItem('greencred_redemptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('greencred_challenges');
    return saved ? JSON.parse(saved) : DEFAULT_CHALLENGES;
  });

  const [participations, setParticipations] = useState<ChallengeParticipation[]>(() => {
    const saved = localStorage.getItem('greencred_participations');
    return saved ? JSON.parse(saved) : [
      {
        id: 'cp_1',
        challenge_id: 'chal_1',
        user_id: 'usr_student_01',
        current_progress: 2,
        completed: false,
        joined_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      }
    ];
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('greencred_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg_1',
        name: 'Dr. Sarah Jenkins',
        email: 'sjenkins@stanford.edu',
        organization: 'Campus Sustainability Office',
        enquiry_type: 'Campus Partnership',
        message: 'We are interested in piloting GreenCred across 4 residential dorms this autumn.',
        status: 'unread',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('greencred_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('greencred_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('greencred_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('greencred_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('greencred_redemptions', JSON.stringify(redemptions));
  }, [redemptions]);

  useEffect(() => {
    localStorage.setItem('greencred_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('greencred_participations', JSON.stringify(participations));
  }, [participations]);

  useEffect(() => {
    localStorage.setItem('greencred_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Load from Supabase if configured
  const refreshData = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch Rules
      const { data: dbRules } = await supabase.from('activity_credit_rules').select('*').order('created_at', { ascending: true });
      if (dbRules && dbRules.length > 0) setRules(dbRules);

      // Fetch Rewards
      const { data: dbRewards } = await supabase.from('rewards').select('*').order('created_at', { ascending: false });
      if (dbRewards && dbRewards.length > 0) setRewards(dbRewards);

      // Fetch Challenges
      const { data: dbChallenges } = await supabase.from('challenges').select('*').order('created_at', { ascending: false });
      if (dbChallenges && dbChallenges.length > 0) setChallenges(dbChallenges);

      // Fetch Activities
      const { data: dbActivities } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
      if (dbActivities) setActivities(dbActivities);

      // Fetch Transactions for current user or admin
      const { data: dbTx } = await supabase.from('credit_transactions').select('*').order('created_at', { ascending: false });
      if (dbTx) setTransactions(dbTx);

      // Fetch Redemptions
      const { data: dbRedemptions } = await supabase.from('redemptions').select('*').order('created_at', { ascending: false });
      if (dbRedemptions) setRedemptions(dbRedemptions);

      // Fetch Participations
      const { data: dbParticipations } = await supabase.from('challenge_participation').select('*');
      if (dbParticipations) setParticipations(dbParticipations);

      // Fetch Contact Messages (Admin only)
      if (isAdmin) {
        const { data: dbMessages } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (dbMessages) setContactMessages(dbMessages);
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser?.id, isAdmin]);

  // DERIVED LEDGER BALANCE (strictly derived from immutable transactions)
  const userBalance = useMemo(() => {
    if (!currentUser) return 0;
    return transactions
      .filter((tx) => tx.user_id === currentUser.id)
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions, currentUser?.id]);

  const userApprovedActivitiesCount = useMemo(() => {
    if (!currentUser) return 0;
    return activities.filter(
      (a) => a.student_id === currentUser.id && a.status === 'approved'
    ).length;
  }, [activities, currentUser?.id]);

  // User environmental impact calculation
  const userTotalCO2SavedKg = useMemo(() => {
    if (!currentUser) return 0;
    const userApproved = activities.filter(
      (a) => a.student_id === currentUser.id && a.status === 'approved'
    );
    return userApproved.reduce((acc, act) => {
      const rule = rules.find((r) => r.activity_type === act.activity_type);
      return acc + (rule ? Number(rule.co2_savings_kg) : 2.0);
    }, 0);
  }, [activities, rules, currentUser?.id]);

  const userTreesEquivalent = useMemo(() => {
    // 1 mature tree absorbs ~21.77 kg of CO2/year
    return Number((userTotalCO2SavedKg / 21.77).toFixed(1));
  }, [userTotalCO2SavedKg]);

  // REAL-TIME CAMPUS LEADERBOARD (Strictly based on verified ledger awards)
  const leaderboard = useMemo<LeaderboardEntry[]>(() => {
    const userTotals: Record<string, { total: number; count: number }> = {};

    transactions.forEach((tx) => {
      if (tx.amount > 0) {
        if (!userTotals[tx.user_id]) {
          userTotals[tx.user_id] = { total: 0, count: 0 };
        }
        userTotals[tx.user_id].total += tx.amount;
      }
    });

    activities.forEach((act) => {
      if (act.status === 'approved') {
        if (!userTotals[act.student_id]) {
          userTotals[act.student_id] = { total: 0, count: 0 };
        }
        userTotals[act.student_id].count += 1;
      }
    });

    // Known demo profiles
    const knownNames: Record<string, { name: string; college: string; avatar: string }> = {
      usr_student_01: {
        name: 'Alex Rivera',
        college: 'Pacific Green University',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      usr_student_02: {
        name: 'Marcus Chen',
        college: 'Pacific Green University',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      usr_student_03: {
        name: 'Priya Sharma',
        college: 'Evergreen State College',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      },
    };

    if (currentUser && currentUser.role === 'student' && !knownNames[currentUser.id]) {
      knownNames[currentUser.id] = {
        name: currentUser.public_alias || currentUser.full_name,
        college: currentUser.college_name,
        avatar: currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.full_name)}`,
      };
    }

    const entries = Object.entries(userTotals)
      .map(([userId, stats]) => {
        const info = knownNames[userId] || {
          name: `Campus Eco-Member #${userId.slice(-4)}`,
          college: 'Green Partner Campus',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
        };
        return {
          user_id: userId,
          display_name: info.name,
          college_name: info.college,
          total_credits: stats.total,
          approved_activities_count: stats.count,
          rank: 0,
          avatar_url: info.avatar,
        };
      })
      .sort((a, b) => b.total_credits - a.total_credits);

    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [transactions, activities, currentUser]);

  // CAMPUS-WIDE ENVIRONMENTAL IMPACT METRICS
  const platformImpact = useMemo<EnvironmentalImpactMetrics>(() => {
    const approved = activities.filter((a) => a.status === 'approved');
    let totalCO2 = 0;
    let wasteDiverted = 0;

    approved.forEach((act) => {
      const rule = rules.find((r) => r.activity_type === act.activity_type);
      const co2 = rule ? Number(rule.co2_savings_kg) : 2.5;
      totalCO2 += co2;
      if (act.activity_type === 'recycling' || act.activity_type === 'plastic_reduction') {
        wasteDiverted += 4.2;
      }
    });

    // Provide baseline campus metrics (transparently tagged as sample demo data until scale)
    const baseCO2 = 4120; // kg
    const baseWaste = 2840; // kg
    const baseActions = 1420;

    return {
      total_co2_kg: Math.round(baseCO2 + totalCO2),
      trees_planted_equiv: Math.round((baseCO2 + totalCO2) / 21.77),
      waste_diverted_kg: Math.round(baseWaste + wasteDiverted),
      green_actions_total: baseActions + approved.length,
      is_demo_data: true,
      calculation_method:
        'Calculated based on verified activity types: Recycling (2.4kg CO2/action), Tree planting (15kg CO2/tree), Sustainable transit (3.8kg CO2/trip), Plastic reduction (1.9kg CO2/action), Campus clean-up (8.5kg CO2/event). Tree equivalent uses EPA standard absorption of 21.77kg CO2/mature tree/year.',
    };
  }, [activities, rules]);

  // ACTIONS

  const submitActivity = async (data: {
    activity_type: string;
    description: string;
    date: string;
    evidence_url?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Must be logged in to submit activities.' };
    if (!data.description.trim()) return { success: false, error: 'Please enter a description.' };

    const rule = rules.find((r) => r.activity_type === data.activity_type);
    const activityTitle = rule ? rule.title : data.activity_type;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('activities')
          .insert({
            student_id: currentUser.id,
            activity_type: data.activity_type,
            description: data.description.trim(),
            date: data.date,
            evidence_url: data.evidence_url,
            status: 'pending',
            credits_awarded: 0,
          })
          .select()
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        if (inserted) {
          setActivities((prev) => [
            {
              ...inserted,
              student_name: currentUser.full_name,
              student_email: currentUser.email,
              activity_title: activityTitle,
            },
            ...prev,
          ]);
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local / Demo Mode
    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_email: currentUser.email,
      activity_type: data.activity_type,
      activity_title: activityTitle,
      description: data.description.trim(),
      date: data.date,
      evidence_url: data.evidence_url,
      status: 'pending',
      credits_awarded: 0,
      created_at: new Date().toISOString(),
    };

    setActivities((prev) => [newActivity, ...prev]);
    return { success: true };
  };

  const approveActivity = async (
    activityId: string,
    creditsToAward?: number
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.' };
    }

    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return { success: false, error: 'Activity not found.' };
    if (activity.status !== 'pending') {
      return { success: false, error: `Activity already reviewed (${activity.status}).` };
    }

    const rule = rules.find((r) => r.activity_type === activity.activity_type);
    const credits = creditsToAward ?? (rule ? rule.default_credits : 20);

    if (credits <= 0) {
      return { success: false, error: 'Credits awarded must be greater than zero.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.rpc('approve_activity', {
          p_activity_id: activityId,
          p_credits: credits,
          p_reviewer_id: currentUser.id,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        await refreshData();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local / Demo Atomic Execution
    const updatedActivities = activities.map((a) =>
      a.id === activityId
        ? {
            ...a,
            status: 'approved' as const,
            credits_awarded: credits,
            reviewed_by: currentUser.id,
            reviewed_by_name: currentUser.full_name,
            reviewed_at: new Date().toISOString(),
          }
        : a
    );
    setActivities(updatedActivities);

    // Insert positive transaction into immutable ledger
    const newTx: CreditTransaction = {
      id: `tx_${Date.now()}`,
      user_id: activity.student_id,
      amount: credits,
      transaction_type: 'activity_award',
      reference_id: activity.id,
      description: `Credits awarded for verified activity: ${activity.activity_title || activity.activity_type}`,
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update active challenge participation
    const matchingChallenges = challenges.filter(
      (c) => c.activity_type === activity.activity_type && c.is_active
    );

    matchingChallenges.forEach((chal) => {
      setParticipations((prev) =>
        prev.map((p) => {
          if (p.challenge_id === chal.id && p.user_id === activity.student_id && !p.completed) {
            const nextProgress = p.current_progress + 1;
            const isCompleted = nextProgress >= chal.target_count;

            if (isCompleted) {
              // Award challenge bonus
              const bonusTx: CreditTransaction = {
                id: `tx_bonus_${Date.now()}`,
                user_id: activity.student_id,
                amount: chal.credit_reward,
                transaction_type: 'challenge_bonus',
                reference_id: chal.id,
                description: `Bonus for completing challenge: ${chal.title}`,
                created_at: new Date().toISOString(),
              };
              setTransactions((txs) => [bonusTx, ...txs]);
            }

            return {
              ...p,
              current_progress: nextProgress,
              completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : undefined,
            };
          }
          return p;
        })
      );
    });

    return { success: true };
  };

  const rejectActivity = async (
    activityId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.' };
    }
    if (!reason.trim()) {
      return { success: false, error: 'A rejection reason is required.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.rpc('reject_activity', {
          p_activity_id: activityId,
          p_reason: reason.trim(),
          p_reviewer_id: currentUser.id,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        await refreshData();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local / Demo Mode
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              status: 'rejected' as const,
              rejection_reason: reason.trim(),
              reviewed_by: currentUser.id,
              reviewed_by_name: currentUser.full_name,
              reviewed_at: new Date().toISOString(),
              credits_awarded: 0,
            }
          : a
      )
    );

    return { success: true };
  };

  const updateCreditRule = async (
    ruleId: string,
    updates: Partial<ActivityCreditRule>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('activity_credit_rules')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', ruleId);

        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r))
    );
    return { success: true };
  };

  const createReward = async (
    reward: Omit<Reward, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('rewards').insert(reward).select().single();
        if (error) return { success: false, error: error.message };
        if (data) setRewards((prev) => [data, ...prev]);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const newRew: Reward = {
      ...reward,
      id: `rew_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setRewards((prev) => [newRew, ...prev]);
    return { success: true };
  };

  const updateReward = async (
    rewardId: string,
    updates: Partial<Reward>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('rewards')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', rewardId);

        if (error) return { success: false, error: error.message };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r))
    );
    return { success: true };
  };

  const redeemReward = async (
    rewardId: string
  ): Promise<{ success: boolean; error?: string; redemptionCode?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'Must be logged in to redeem rewards.' };
    }

    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, error: 'Reward not found.' };
    if (!reward.is_active) return { success: false, error: 'Reward is currently inactive.' };
    if (reward.available_stock <= 0) return { success: false, error: 'Reward is out of stock.' };

    // Strict ledger balance check
    if (userBalance < reward.credit_cost) {
      return {
        success: false,
        error: `Insufficient Green Credits. You have ${userBalance} credits, but ${reward.credit_cost} are required.`,
      };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('redeem_reward', {
          p_reward_id: rewardId,
          p_user_id: currentUser.id,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        await refreshData();
        return {
          success: true,
          redemptionCode: data?.redemption_code || 'CLAIMED',
        };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local / Demo Atomic Redemption
    const voucherCode = `GC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 1. Decrement stock
    setRewards((prev) =>
      prev.map((r) =>
        r.id === rewardId
          ? { ...r, available_stock: Math.max(0, r.available_stock - 1) }
          : r
      )
    );

    // 2. Insert negative ledger transaction
    const debitTx: CreditTransaction = {
      id: `tx_${Date.now()}`,
      user_id: currentUser.id,
      amount: -reward.credit_cost,
      transaction_type: 'reward_redemption',
      reference_id: rewardId,
      description: `Redeemed: ${reward.title}`,
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [debitTx, ...prev]);

    // 3. Create redemption claim record
    const newRedemption: Redemption = {
      id: `red_${Date.now()}`,
      reward_id: rewardId,
      reward_title: reward.title,
      reward_image: reward.image_url,
      user_id: currentUser.id,
      credits_spent: reward.credit_cost,
      redemption_code: voucherCode,
      status: 'redeemed',
      created_at: new Date().toISOString(),
    };
    setRedemptions((prev) => [newRedemption, ...prev]);

    return {
      success: true,
      redemptionCode: voucherCode,
    };
  };

  const createChallenge = async (
    challenge: Omit<Challenge, 'id' | 'created_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('challenges').insert(challenge).select().single();
        if (error) return { success: false, error: error.message };
        if (data) setChallenges((prev) => [data, ...prev]);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const newChal: Challenge = {
      ...challenge,
      id: `chal_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setChallenges((prev) => [newChal, ...prev]);
    return { success: true };
  };

  const joinChallenge = async (challengeId: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Must be logged in to join challenges.' };

    const existing = participations.find(
      (p) => p.challenge_id === challengeId && p.user_id === currentUser.id
    );
    if (existing) {
      return { success: false, error: 'You have already joined this challenge.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('challenge_participation')
          .insert({
            challenge_id: challengeId,
            user_id: currentUser.id,
            current_progress: 0,
            completed: false,
          })
          .select()
          .single();

        if (error) return { success: false, error: error.message };
        if (data) setParticipations((prev) => [...prev, data]);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const newPart: ChallengeParticipation = {
      id: `cp_${Date.now()}`,
      challenge_id: challengeId,
      user_id: currentUser.id,
      current_progress: 0,
      completed: false,
      joined_at: new Date().toISOString(),
    };
    setParticipations((prev) => [...prev, newPart]);
    return { success: true };
  };

  const submitContactMessage = async (
    msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!msg.name || !msg.email || !msg.message) {
      return { success: false, error: 'Please fill in your name, email, and message.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('contact_messages').insert({
          ...msg,
          status: 'unread',
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const newMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    return { success: true };
  };

  const updateMessageStatus = async (
    messageId: string,
    status: ContactMessage['status']
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .update({ status })
          .eq('id', messageId);
        if (error) return { success: false, error: error.message };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setContactMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, status } : m))
    );
    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        rules,
        activities,
        transactions,
        rewards,
        redemptions,
        challenges,
        participations,
        contactMessages,
        loading,
        userBalance,
        userApprovedActivitiesCount,
        userTotalCO2SavedKg,
        userTreesEquivalent,
        leaderboard,
        platformImpact,
        submitActivity,
        approveActivity,
        rejectActivity,
        updateCreditRule,
        createReward,
        updateReward,
        redeemReward,
        createChallenge,
        joinChallenge,
        submitContactMessage,
        updateMessageStatus,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
