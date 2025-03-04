"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabaseClient"
import { Database } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

type TaxLiability = Database["public"]["Tables"]["tax_liabilities"]["Row"]

export function TaxLiability() {
  const { user } = useAuth()
  const [taxLiabilities, setTaxLiabilities] = useState<TaxLiability[]>([])
  const [loading, setLoading] = useState(true)
  const [newLiability, setNewLiability] = useState({
    description: "",
    amount: "",
    due_date: format(new Date(), "yyyy-MM-dd"),
  })

  useEffect(() => {
    if (user) {
      fetchTaxLiabilities()
    }
  }, [user])

  const fetchTaxLiabilities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("tax_liabilities")
        .select("*")
        .eq("user_id", user?.id)
        .order("due_date")

      if (error) throw error
      setTaxLiabilities(data || [])
    } catch (error) {
      console.error("Error fetching tax liabilities:", error)
      toast({
        title: "Error",
        description: "Failed to load tax liabilities",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTaxLiability = async () => {
    if (!newLiability.description.trim() || !newLiability.amount.trim()) return

    try {
      const { data, error } = await supabase
        .from("tax_liabilities")
        .insert([
          {
            description: newLiability.description.trim(),
            amount: parseFloat(newLiability.amount),
            due_date: newLiability.due_date,
            user_id: user?.id,
            status: "pending",
          },
        ])
        .select()

      if (error) throw error

      setTaxLiabilities([...taxLiabilities, data[0]])
      setNewLiability({
        description: "",
        amount: "",
        due_date: format(new Date(), "yyyy-MM-dd"),
      })
      toast({
        title: "Success",
        description: "Tax liability added successfully",
      })
    } catch (error) {
      console.error("Error adding tax liability:", error)
      toast({
        title: "Error",
        description: "Failed to add tax liability",
        variant: "destructive",
      })
    }
  }

  const markAsPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tax_liabilities")
        .update({ status: "paid" })
        .eq("id", id)
        .eq("user_id", user?.id)

      if (error) throw error

      setTaxLiabilities(
        taxLiabilities.map((liability) =>
          liability.id === id ? { ...liability, status: "paid" } : liability
        )
      )
      toast({
        title: "Success",
        description: "Tax liability marked as paid",
      })
    } catch (error) {
      console.error("Error updating tax liability:", error)
      toast({
        title: "Error",
        description: "Failed to update tax liability",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading tax liabilities...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Liabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newLiability.description}
                onChange={(e) =>
                  setNewLiability({ ...newLiability, description: e.target.value })
                }
                placeholder="Q1 Estimated Tax"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newLiability.amount}
                onChange={(e) =>
                  setNewLiability({ ...newLiability, amount: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newLiability.due_date}
                onChange={(e) =>
                  setNewLiability({ ...newLiability, due_date: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            onClick={addTaxLiability}
            className="w-full"
            disabled={!newLiability.description.trim() || !newLiability.amount.trim()}
          >
            Add Tax Liability
          </Button>

          <div className="space-y-2">
            {taxLiabilities.map((liability) => (
              <div
                key={liability.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  liability.status === "paid"
                    ? "bg-muted border-muted"
                    : "bg-white border-border"
                }`}
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{liability.description}</h3>
                  <div className="text-sm text-muted-foreground">
                    Due: {format(new Date(liability.due_date), "MMM d, yyyy")}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold">
                    ${liability.amount.toFixed(2)}
                  </div>
                  {liability.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsPaid(liability.id)}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {taxLiabilities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No tax liabilities yet. Add some to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

