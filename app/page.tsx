import Link from "next/link"
import { ArrowRight, PieChart, TrendingUp, Receipt, Bell, Lock, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                  FinanceTrack
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Your All-in-One Personal Finance Manager
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Take control of your taxes, subscriptions, and personal finances with FinanceTrack.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Powerful Features for Complete Financial Control</h2>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            {[
              {
                icon: Receipt,
                title: "Tax Management System",
                description: "AI-powered expense categorization and real-time tax reports.",
              },
              {
                icon: Bell,
                title: "Subscription Expense Tracker",
                description: "Auto-detect recurring expenses and get alerts before charges.",
              },
              {
                icon: PieChart,
                title: "Personal Finance Dashboard",
                description: "Real-time monitoring of expenses, income, and investments.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose FinanceTrack?</h2>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "All-in-One Convenience",
                description: "Consolidate tax prep, subscriptions, and finances in one app.",
              },
              {
                icon: TrendingUp,
                title: "Smart Financial Insights",
                description: "Get AI-driven recommendations to improve your financial health.",
              },
              {
                icon: Lock,
                title: "Security & Privacy",
                description: "Your data is encrypted and protected with top-tier security.",
              },
              {
                icon: Bell,
                title: "Customizable Alerts",
                description: "Stay on top of bills, payments, and budget limits.",
              },
            ].map((benefit, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{benefit.title}</h3>
                <p className="mt-2 text-base text-gray-500 text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security and Integrations */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Bank-Level Security & Seamless Integrations</h2>
              <p className="mt-4 text-lg text-gray-500">
                FinanceTrack uses AES-256 encryption and OAuth 2.0 for authentication. We integrate with major banks and
                financial services to provide you with real-time, accurate data.
              </p>
              <div className="mt-8 flex">
                <Link
                  href="/security"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                >
                  Learn more about our security
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
              {["Bank of America", "Chase", "Wells Fargo", "Citibank", "American Express", "PayPal"].map((bank) => (
                <div key={bank} className="col-span-1 flex justify-center py-8 px-8 bg-white">
                  <img className="max-h-12" src={`/placeholder.svg?height=48&width=120`} alt={bank} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to take control of your finances?</span>
            <span className="block mt-2">Try our dashboard now.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            No sign up required. Experience the power of FinanceTrack instantly.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">© 2023 FinanceTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

