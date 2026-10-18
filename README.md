# GreenCred — Every Green Action Counts 🌿

> **Full-Stack Sustainability Rewards Platform for College Campuses**

GreenCred is a campus sustainability application that turns daily student eco-actions—such as recycling, bike commuting, single-use plastic reduction, tree planting, and campus clean-ups—into verified **Green Credits** backed by an immutable ledger. Students can redeem their earned credits for meal vouchers, transit passes, textbook discounts, and eco-merchandise, while campus sustainability offices gain auditable carbon offset data and AASHE STARS compliance metrics.

---

## 🌟 Key Features

### 1. Public Landing Page & Partner Inquiries
- **Hero & Mission**: Highlighting campus climate leadership and community stewardship.
- **Problem & Solution**: Comparing passive campus waste disposal fatigue with verified micro-incentives.
- **3-Step Loop**: *Take Action → Earn Green Credits → Redeem Rewards*.
- **Impact Showcase**: Scientific carbon offset equations (EPA standards) with transparent methodology disclosures.
- **Audience Benefits**: Dedicated value propositions for students, university administrators, and campus merchant partners.
- **Interactive FAQ & Connected Contact Form**: Persisted to the database and accessible via the Administrator Console.

### 2. Dual-Mode Backend Integration (Supabase Cloud + Local Evaluation Mode)
- **Live Supabase PostgreSQL Cloud**: Connect your own Supabase project in 3 minutes via the top **Connect Supabase** banner or `.env` configuration.
- **Full Local Demo Mode**: Instant zero-config evaluation with pre-seeded data, local ledger calculation, and base64 evidence preview.
- **Immutable Ledger System**: Displays balances strictly derived from `credit_transactions` (never trusting client inputs).
- **Atomic Stored Procedures**:
  - `approve_activity`: Atomically validates pending status, updates activity, mints credits to the ledger, and advances challenge progress.
  - `reject_activity`: Atomically rejects submissions with reviewer feedback.
  - `redeem_reward`: Locks row with `FOR UPDATE`, verifies available stock and ledger balance, decrements stock, issues voucher code, and records debit ledger entry.

### 3. Student Dashboard & Activity Submission
- **Real-Time Balance & Carbon Offset**: Live Green Credits balance, kilograms of CO₂ avoided, and mature tree equivalents.
- **Evidence-Based Submission**: Upload photo evidence (up to 5MB, JPG/PNG/WebP), select from configurable activity categories, and see estimated credits.
- **Activity Tracker**: Filter by Pending, Approved, and Rejected with reviewer remarks and evidence inspector.
- **Campus Challenges**: Join goal-oriented campus campaigns and track progress towards bonus credit rewards.
- **My Vouchers**: View unique digital claim codes (e.g., `GC-9F42-88B1`) for campus collection.

### 4. Campus Administrator Command Center
- **Verification Queue**: Inspect student photo evidence, approve with custom credit awards, or reject with constructive feedback.
- **Credit & CO₂ Rules Editor**: Configure baseline credit awards and CO₂ offset metrics per activity type.
- **Rewards Inventory Management**: Add new rewards, edit active stock allocations, and toggle catalog visibility.
- **Campus Challenges Launcher**: Publish campus-wide climate challenges with date ranges and milestone thresholds.
- **Inquiries Inbox**: Review and respond to contact messages submitted from the public landing page.

### 5. Privacy-First Campus Leaderboard
- Displays top student rankings based strictly on approved ledger transactions.
- FERPA-compliant privacy controls: displays chosen public eco-aliases rather than private contact information.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Canvas Confetti.
- **Backend / Database**: Supabase (PostgreSQL 15+, Row-Level Security, Database Functions, Triggers, Storage).
- **Tooling & Build**: Vite, PostCSS, TypeScript compiler.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. **Clone the repository and enter directory**:
   ```bash
   cd c:/Users/admin/Desktop/bharani
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_ADMIN_SECRET_KEY=GREEN_ADMIN_2026
   ```

4. **Start the local development server**:
   ```powershell
   cmd.exe /c "npm run dev"
   ```
   Open your browser at `http://localhost:5173`.

---

## 🗄️ Supabase Cloud Database Setup

To run GreenCred against your own live Supabase project:

### Step 1: Create a Supabase Project
1. Log in to [https://supabase.com](https://supabase.com) and click **New Project**.
2. Name your project (e.g., `greencred-campus`) and choose a database password.

### Step 2: Run Database Migrations
1. Navigate to the **SQL Editor** tab in your Supabase dashboard.
2. Open the file `supabase/migrations/20261018000000_init_greencred.sql` from this repository.
3. Paste the entire SQL content into the Supabase SQL Editor and click **Run**.
   - This sets up all 9 tables: `profiles`, `activities`, `activity_credit_rules`, `credit_transactions`, `rewards`, `redemptions`, `challenges`, `challenge_participation`, and `contact_messages`.
   - It also enables Row-Level Security (RLS) on all tables and creates the stored functions: `approve_activity`, `reject_activity`, `redeem_reward`, and `is_admin`.

### Step 3: Run Seed Data (Optional but Recommended)
1. In the Supabase **SQL Editor**, open `supabase/seed.sql`.
2. Paste and run the script to populate initial activity credit rules, sample campus rewards, and active sustainability challenges.

### Step 4: Configure Storage Bucket for Activity Evidence
1. Navigate to **Storage** in the Supabase Dashboard.
2. Click **Create new bucket**:
   - Bucket name: `activity-evidence`
   - Public bucket: **Yes** (checked)
   - Allowed MIME types: `image/jpeg, image/png, image/webp`
   - Max file size: `5MB`
3. Click **Save bucket**.

### Step 5: Connect Frontend
1. Go to **Project Settings → API** in Supabase.
2. Copy your **Project URL** and **Anon (Public) Key**.
3. Either paste them into `.env`, or click **Connect Supabase Cloud** in the GreenCred web app's top notification banner to paste them live!

---

## 🔐 Administrator Role Provisioning

To prevent unauthorized privilege escalation, the platform restricts administrator registration:
1. When registering via the UI, select **College Administrator**.
2. Enter the Administrator Authorization Key (Default: `GREEN_ADMIN_2026`).
3. Alternatively, you can promote any registered user directly in SQL:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-email@campus.edu';
   ```

---

## 🧪 Testing & Verification Guide

### Pre-Configured Demo Accounts
You can immediately switch personas using the **Role: Student / Admin** toggle in the navigation bar:
- **Demo Student**: `alex.rivera@campus.edu` (Alex Rivera • Pacific Green University • 65 Credits)
- **Demo Admin**: `admin.sustainability@campus.edu` (Dean Eleanor Vance • Administrator)

### Recommended Test Workflows:
1. **Activity Submission & Admin Approval**:
   - As a student, click **Log Action** and submit a recycling activity with a photo.
   - Note that your balance **does not** increase immediately (status: `pending`).
   - Switch to **Admin** role via the navbar.
   - Open **Admin Hub → Verification Queue**.
   - Inspect the photo, customize or keep credit award, and click **Approve & Award**.
   - Switch back to **Student** role: verify your Green Credits balance has increased exactly according to the award in your ledger!
2. **Reward Redemption & Race Condition Check**:
   - As a student, navigate to **Rewards**.
   - Select an in-stock reward (e.g. *Campus Eco-Thermal Tumbler* for 120 credits).
   - If balance is insufficient, verify the button warns you of needed credits.
   - If balance is sufficient, confirm redemption: observe confetti celebration, stock decrement, unique voucher code generation, and negative transaction in your ledger.
3. **Public Landing Page & Contact Inquiries**:
   - Navigate to **Overview**, scroll to the bottom contact form, and send a message.
   - Switch to **Admin Hub → Contact Inquiries**: verify the message was received and can be marked as read or responded.

---

## 📄 License
MIT License. Built for collegiate sustainability programs worldwide.
Every Green Action Counts.
