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
import { Trash2, Plus } from "lucide-react"

type Category = Database["public"]["Tables"]["categories"]["Row"]

export function ExpenseCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchCategories()
    }
  }, [user])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user?.id)
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
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: newCategory.trim(),
            user_id: user?.id,
          },
        ])
        .select()

      if (error) throw error

      setCategories([...categories, data[0]])
      setNewCategory("")
      toast({
        title: "Success",
        description: "Category added successfully",
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      })
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("user_id", user?.id)

      if (error) throw error

      setCategories(categories.filter((cat) => cat.id !== categoryId))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading categories...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="newCategory">New Category</Label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                onKeyPress={(e) => e.key === "Enter" && addCategory()}
              />
            </div>
            <Button
              onClick={addCategory}
              className="mt-6"
              disabled={!newCategory.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <span>{category.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCategory(category.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No categories yet. Add some to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

