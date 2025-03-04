export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bank_accounts: {
        Row: {
          id: string
          user_id: string
          institution_name: string
          institution_id: string
          item_id: string
          status: 'active' | 'disconnected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          institution_name: string
          institution_id: string
          item_id: string
          status?: 'active' | 'disconnected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          institution_name?: string
          institution_id?: string
          item_id?: string
          status?: 'active' | 'disconnected'
          created_at?: string
          updated_at?: string
        }
      }
      bank_transactions: {
        Row: {
          id: string
          user_id: string
          bank_account_id: string
          transaction_id: string
          amount: number
          description: string | null
          category: string | null
          date: string
          pending: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bank_account_id: string
          transaction_id: string
          amount: number
          description?: string | null
          category?: string | null
          date: string
          pending?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bank_account_id?: string
          transaction_id?: string
          amount?: number
          description?: string | null
          category?: string | null
          date?: string
          pending?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'income' | 'expense'
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          amount: number
          description: string | null
          date: string
          type: 'income' | 'expense'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          amount: number
          description?: string | null
          date: string
          type: 'income' | 'expense'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          amount?: number
          description?: string | null
          date?: string
          type?: 'income' | 'expense'
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          billing_cycle: 'monthly' | 'yearly' | 'quarterly'
          next_billing_date: string
          category_id: string | null
          description: string | null
          created_at: string
          status: 'active' | 'cancelled' | 'paused'
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          amount: number
          billing_cycle: 'monthly' | 'yearly' | 'quarterly'
          next_billing_date: string
          category_id?: string | null
          description?: string | null
          created_at?: string
          status?: 'active' | 'cancelled' | 'paused'
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          amount?: number
          billing_cycle?: 'monthly' | 'yearly' | 'quarterly'
          next_billing_date?: string
          category_id?: string | null
          description?: string | null
          created_at?: string
          status?: 'active' | 'cancelled' | 'paused'
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          amount: number
          period: 'monthly' | 'yearly'
          start_date: string
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          amount: number
          period: 'monthly' | 'yearly'
          start_date: string
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          amount?: number
          period?: 'monthly' | 'yearly'
          start_date?: string
          end_date?: string | null
          created_at?: string
        }
      }
      tax_documents: {
        Row: {
          id: string
          user_id: string
          name: string
          document_url: string
          tax_year: number
          category: 'w2' | '1099' | 'receipt' | 'other'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          document_url: string
          tax_year: number
          category: 'w2' | '1099' | 'receipt' | 'other'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          document_url?: string
          tax_year?: number
          category?: 'w2' | '1099' | 'receipt' | 'other'
          created_at?: string
        }
      }
      tax_liabilities: {
        Row: {
          id: string
          user_id: string
          description: string
          amount: number
          due_date: string
          status: 'pending' | 'paid'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          amount: number
          due_date: string
          status?: 'pending' | 'paid'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          amount?: number
          due_date?: string
          status?: 'pending' | 'paid'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 