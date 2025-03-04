"use client"

import { useState } from "react"
import { useSubscriptions } from "@/hooks/useSubscriptions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, addMonths, addYears, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function SubscriptionsPage() {
  const { subscriptions, loading, error, addSubscription, calculateMonthlySpending } = useSubscriptions()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSubscription, setNewSubscription] = useState({
    name: "",
    amount: "",
    billing_cycle: "monthly" as "monthly" | "yearly" | "quarterly",
    next_billing_date: new Date(),
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addSubscription({
        name: newSubscription.name,
        amount: parseFloat(newSubscription.amount),
        billing_cycle: newSubscription.billing_cycle,
        next_billing_date: format(newSubscription.next_billing_date, "yyyy-MM-dd"),
        description: newSubscription.description,
        status: "active",
      })
      setIsAddDialogOpen(false)
      setNewSubscription({
        name: "",
        amount: "",
        billing_cycle: "monthly",
        next_billing_date: new Date(),
        description: "",
      })
    } catch (error) {
      console.error("Error adding subscription:", error)
    }
  }

  const getNextBillingDate = (date: Date, cycle: "monthly" | "yearly" | "quarterly") => {
    switch (cycle) {
      case "monthly":
        return addMonths(date, 1)
      case "yearly":
        return addYears(date, 1)
      case "quarterly":
        return addMonths(date, 3)
      default:
        return date
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading subscriptions: {error}
      </div>
    )
  }

  const monthlySpending = calculateMonthlySpending()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-gray-600 mt-2">
            Monthly spending: ${monthlySpending.toFixed(2)}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
              <DialogDescription>
                Add a new subscription to track your recurring payments.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newSubscription.name}
                    onChange={(e) =>
                      setNewSubscription({ ...newSubscription, name: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newSubscription.amount}
                    onChange={(e) =>
                      setNewSubscription({ ...newSubscription, amount: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="billing_cycle" className="text-right">
                    Billing Cycle
                  </Label>
                  <Select
                    value={newSubscription.billing_cycle}
                    onValueChange={(value: "monthly" | "yearly" | "quarterly") =>
                      setNewSubscription({ ...newSubscription, billing_cycle: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="next_billing_date" className="text-right">
                    Next Billing
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !newSubscription.next_billing_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSubscription.next_billing_date ? (
                          format(newSubscription.next_billing_date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSubscription.next_billing_date}
                        onSelect={(date) =>
                          setNewSubscription({
                            ...newSubscription,
                            next_billing_date: date || new Date(),
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newSubscription.description}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Subscription</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billing Cycle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Billing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subscription.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${subscription.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscription.billing_cycle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(subscription.next_billing_date), "PP")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={cn(
                      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                      {
                        "bg-green-100 text-green-800": subscription.status === "active",
                        "bg-red-100 text-red-800": subscription.status === "cancelled",
                        "bg-yellow-100 text-yellow-800": subscription.status === "paused",
                      }
                    )}
                  >
                    {subscription.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

