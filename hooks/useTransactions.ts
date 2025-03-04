import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/hooks/useAuth"
import { Database } from "@/lib/database.types"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"]
type TransactionUpdate = Database["public"]["Tables"]["transactions"]["Update"]

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })

      if (error) throw error
      setTransactions(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (transaction: Omit<TransactionInsert, "user_id">) => {
    try {
      if (!user) throw new Error("User not authenticated")
      
      const { data, error } = await supabase
        .from("transactions")
        .insert([{ ...transaction, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      setTransactions(prev => [data, ...prev])
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setTransactions(prev =>
        prev.map(transaction => (transaction.id === id ? data : transaction))
      )
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)

      if (error) throw error
      setTransactions(prev => prev.filter(transaction => transaction.id !== id))
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const getTransactionsByDateRange = async (startDate: string, endDate: string) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false })

      if (error) throw error
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const getTransactionsByCategory = async (categoryId: string) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("category_id", categoryId)
        .order("date", { ascending: false })

      if (error) throw error
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    refreshTransactions: fetchTransactions,
  }
} 