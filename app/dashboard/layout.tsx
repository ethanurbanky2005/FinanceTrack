"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DollarSign, Settings, Home, FileText, Calendar, Bell, LogOut } from "lucide-react"

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Taxes", href: "/dashboard/taxes", icon: FileText },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: Calendar },
  { name: "Budget", href: "/dashboard/budget", icon: DollarSign },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-white w-64 border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
            FinanceTrack
          </Link>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 ${
                  isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="mx-4 font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
              <div className="flex items-center">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                </button>
                <Link
                  href="/"
                  className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Exit Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

