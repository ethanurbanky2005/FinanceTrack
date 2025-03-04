# FinanceTrack

A comprehensive financial management application built with Next.js and Supabase. Track your expenses, manage subscriptions, monitor tax liabilities, and more.

## Features

- 📊 Dashboard with financial overview and analytics
- 💰 Transaction tracking and categorization
- 📅 Subscription management
- 📑 Tax management (liabilities, deductions, and documents)
- 📈 Budget tracking with visual representations
- 🔒 Secure authentication with Supabase

## Tech Stack

- Next.js 14
- TypeScript
- Supabase (Authentication & Database)
- Tailwind CSS
- shadcn/ui Components
- Recharts for data visualization

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/financetrack.git
cd financetrack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Initialize the database:
- Create a new Supabase project
- Run the SQL schema provided in `supabase/schema.sql`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable React components
- `/hooks` - Custom React hooks for data management
- `/lib` - Utility functions and type definitions
- `/public` - Static assets
- `/supabase` - Database schema and configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 