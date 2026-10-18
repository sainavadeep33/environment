# GreenCred — Every Green Action Counts 🌿

**Full-Stack Sustainability Rewards Platform for College Campuses**

GreenCred is a campus sustainability application that rewards students for eco-friendly actions such as recycling, bike commuting, reducing single-use plastics, tree planting, and campus clean-ups.

Students earn Green Credits for verified activities and redeem them for rewards, while campus administrators track sustainability impact.

## Key Features

- Student dashboard with Green Credits and carbon-offset tracking.
- Eco-friendly activity submissions with photo evidence.
- Administrator activity verification and credit approval.
- Rewards catalog and voucher redemption.
- Campus sustainability challenges.
- Privacy-conscious student leaderboard.
- Supabase cloud database integration and local demo mode.

## Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4
- **Build Tool:** Vite
- **Backend / Database:** Supabase, PostgreSQL
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm

### Installation

```bash
npm install
npm run dev
```

Open the local URL displayed in your terminal.

### Environment Configuration

Configure your Supabase project credentials using the environment variable names documented in `.env.example`, if required.

**Important:** Never commit private API keys, passwords, or secrets to GitHub.

## Database Setup

1. Create a Supabase project.
2. Run the SQL migration in `supabase/migrations/`.
3. Optionally run `supabase/seed.sql` for sample data.
4. Configure the required storage bucket and environment variables.

## License

MIT License.
