import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/hooks/useAuth"
import { Database } from "@/lib/database.types"

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]
type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"]
type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"]

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchSubscriptions()
    }
  }, [user])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("next_billing_date", { ascending: true })

      if (error) throw error
      setSubscriptions(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addSubscription = async (subscription: Omit<SubscriptionInsert, "user_id">) => {
    try {
      if (!user) throw new Error("User not authenticated")
      
      const { data, error } = await supabase
        .from("subscriptions")
        .insert([{ ...subscription, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      setSubscriptions(prev => [data, ...prev])
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const updateSubscription = async (id: string, updates: SubscriptionUpdate) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setSubscriptions(prev =>
        prev.map(subscription => (subscription.id === id ? data : subscription))
      )
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const deleteSubscription = async (id: string) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id)

      if (error) throw error
      setSubscriptions(prev => prev.filter(subscription => subscription.id !== id))
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const getUpcomingRenewals = async (days: number = 30) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + days)

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .gte("next_billing_date", today.toISOString().split("T")[0])
        .lte("next_billing_date", futureDate.toISOString().split("T")[0])
        .eq("status", "active")
        .order("next_billing_date", { ascending: true })

      if (error) throw error
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const calculateMonthlySpending = () => {
    return subscriptions.reduce((total, subscription) => {
      if (subscription.status !== "active") return total

      const amount = subscription.amount
      switch (subscription.billing_cycle) {
        case "monthly":
          return total + amount
        case "yearly":
          return total + amount / 12
        case "quarterly":
          return total + amount / 3
        default:
          return total
      }
    }, 0)
  }

  return {
    subscriptions,
    loading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getUpcomingRenewals,
    calculateMonthlySpending,
    refreshSubscriptions: fetchSubscriptions,
  }
} 