"use client"

import { useEffect, useState } from "react"
import { useTransactions } from "@/hooks/useTransactions"
import { useSubscriptions } from "@/hooks/useSubscriptions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ArrowUpIcon, ArrowDownIcon, CreditCard, Calendar, PiggyBank } from "lucide-react"

export default function DashboardPage() {
  const { transactions, getTransactionsByDateRange } = useTransactions()
  const { subscriptions, calculateMonthlySpending } = useSubscriptions()
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i)
        return {
          start: startOfMonth(date),
          end: endOfMonth(date),
          month: format(date, "MMM yyyy"),
        }
      }).reverse()

      const monthlyTransactions = await Promise.all(
        last6Months.map(async ({ start, end, month }) => {
          const transactions = await getTransactionsByDateRange(
            format(start, "yyyy-MM-dd"),
            format(end, "yyyy-MM-dd")
          )

          const income = transactions
            ?.filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0)

          const expenses = transactions
            ?.filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0)

          return {
            month,
            income: income || 0,
            expenses: expenses || 0,
            balance: (income || 0) - (expenses || 0),
          }
        })
      )

      setMonthlyData(monthlyTransactions)
    }

    fetchMonthlyData()
  }, [getTransactionsByDateRange])

  const currentMonthIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date) >= startOfMonth(new Date()) &&
        new Date(t.date) <= endOfMonth(new Date())
    )
    .reduce((sum, t) => sum + t.amount, 0)

  const currentMonthExpenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date) >= startOfMonth(new Date()) &&
        new Date(t.date) <= endOfMonth(new Date())
    )
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlySubscriptionCost = calculateMonthlySpending()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Financial Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              For {format(new Date(), "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              For {format(new Date(), "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlySubscriptionCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Monthly recurring cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(currentMonthIncome - currentMonthExpenses).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              For {format(new Date(), "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>6 Month Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                name="Income"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                name="Expenses"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                name="Balance"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

