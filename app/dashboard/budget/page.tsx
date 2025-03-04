import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { ExpenseCategories } from "@/components/dashboard/expense-categories"

export default function BudgetPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Budget Planner</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Your monthly budget allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetOverview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Breakdown of your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseCategories />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

