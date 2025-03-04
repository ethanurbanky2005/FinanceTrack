"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabaseClient"
import { Database } from "@/lib/database.types"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

type Budget = Database["public"]["Tables"]["budgets"]["Row"]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function BudgetOverview() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)
  const [totalBudget, setTotalBudget] = useState(0)

  useEffect(() => {
    if (user) {
      fetchBudgets()
    }
  }, [user])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const { data: budgetData, error: budgetError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user?.id)

      if (budgetError) throw budgetError

      // Calculate total budget
      const total = budgetData?.reduce((sum, budget) => sum + budget.amount, 0) || 0
      setTotalBudget(total)
      setBudgets(budgetData || [])

      // Fetch transactions to calculate spending
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user?.id)
        .eq("type", "expense")
        .gte("date", startOfMonth.toISOString())

      if (transactionError) throw transactionError

      const spent = transactionData?.reduce((sum, tx) => sum + tx.amount, 0) || 0
      setTotalSpent(spent)
    } catch (error) {
      console.error("Error fetching budget data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading budget data...</div>
  }

  const spendingProgress = (totalSpent / totalBudget) * 100
  const pieData = budgets.map((budget) => ({
    name: budget.category_id,
    value: budget.amount,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Spending</span>
              <span>${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}</span>
            </div>
            <Progress value={spendingProgress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {spendingProgress > 100 ? (
                <span className="text-red-500">Over budget by ${(totalSpent - totalBudget).toFixed(2)}</span>
              ) : (
                <span>Remaining: ${(totalBudget - totalSpent).toFixed(2)}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: $${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

