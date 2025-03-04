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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

export function TaxDeductions() {
  const { user } = useAuth()
  const [deductions, setDeductions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [newDeduction, setNewDeduction] = useState({
    description: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
    category_id: "",
  })
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (user) {
      fetchDeductions()
      fetchCategories()
    }
  }, [user])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("user_id", user?.id)
        .eq("type", "expense")
        .order("name")

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    }
  }

  const fetchDeductions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("transactions")
        .select("*, categories(name)")
        .eq("user_id", user?.id)
        .eq("type", "expense")
        .order("date", { ascending: false })

      if (error) throw error
      setDeductions(data || [])
    } catch (error) {
      console.error("Error fetching deductions:", error)
      toast({
        title: "Error",
        description: "Failed to load deductions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addDeduction = async () => {
    if (!newDeduction.description.trim() || !newDeduction.amount.trim()) return

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            description: newDeduction.description.trim(),
            amount: parseFloat(newDeduction.amount),
            date: newDeduction.date,
            category_id: newDeduction.category_id || null,
            user_id: user?.id,
            type: "expense",
          },
        ])
        .select()

      if (error) throw error

      setDeductions([data[0], ...deductions])
      setNewDeduction({
        description: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
        category_id: "",
      })
      toast({
        title: "Success",
        description: "Deduction added successfully",
      })
    } catch (error) {
      console.error("Error adding deduction:", error)
      toast({
        title: "Error",
        description: "Failed to add deduction",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading deductions...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Deductions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newDeduction.description}
                onChange={(e) =>
                  setNewDeduction({ ...newDeduction, description: e.target.value })
                }
                placeholder="Office supplies"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newDeduction.amount}
                onChange={(e) =>
                  setNewDeduction({ ...newDeduction, amount: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newDeduction.date}
                onChange={(e) =>
                  setNewDeduction({ ...newDeduction, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newDeduction.category_id}
                onValueChange={(value) =>
                  setNewDeduction({ ...newDeduction, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={addDeduction}
            className="w-full"
            disabled={!newDeduction.description.trim() || !newDeduction.amount.trim()}
          >
            Add Deduction
          </Button>

          <div className="space-y-2">
            {deductions.map((deduction) => (
              <div
                key={deduction.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-white"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{deduction.description}</h3>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(deduction.date), "MMM d, yyyy")}
                    {deduction.category_id && (
                      <span className="ml-2">
                        • {categories.find((c) => c.id === deduction.category_id)?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  ${deduction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {deductions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No deductions yet. Add some to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 