# FinanceTrack

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fethanurbanky2005%2FFinanceTrack&project-name=my-financetrack&repository-name=financetrack-personal&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&env-description=API%20keys%20needed%20for%20Supabase%20configuration.%20Get%20them%20from%20your%20Supabase%20project%20settings.&demo-title=FinanceTrack&demo-description=Personal%20Financial%20Management%20App&demo-url=https%3A%2F%2Ffinancetrack-personal.vercel.app)

A comprehensive financial management application built with Next.js and Supabase. Track your expenses, manage subscriptions, monitor tax liabilities, and more.

[🔗 View Demo](https://financetrack-personal.vercel.app) | [📖 Documentation](https://github.com/ethanurbanky2005/FinanceTrack/wiki) | [🐛 Report Bug](https://github.com/ethanurbanky2005/FinanceTrack/issues)

## Features

- 📊 Dashboard with financial overview and analytics
- 💰 Transaction tracking and categorization
- 📅 Subscription management
- 📑 Tax management (liabilities, deductions, and documents)
- 📈 Budget tracking with visual representations
- 🔒 Secure authentication with Supabase

## Quick Start

### 1-Click Deploy

The easiest way to deploy your own copy of FinanceTrack:

1. Click the "Deploy with Vercel" button above
2. Set up your Supabase project
3. Configure the environment variables
4. Deploy!

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ethanurbanky2005/FinanceTrack.git
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

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Supabase](https://supabase.com/) - Backend & Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Recharts](https://recharts.org/) - Data Visualization

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable React components
- `/hooks` - Custom React hooks for data management
- `/lib` - Utility functions and type definitions
- `/public` - Static assets
- `/supabase` - Database schema and configuration

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

- 📫 [Email Support](mailto:support@financetrack.com)
- 💬 [Discord Community](https://discord.gg/financetrack)
- 📖 [Documentation](https://github.com/ethanurbanky2005/FinanceTrack/wiki)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 