"use client"

import { useState, useCallback } from "react"
import { usePlaidLink } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabaseClient"

export function BankConnection() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [linkedAccounts, setLinkedAccounts] = useState([])

  // This would be replaced with an actual API call to your backend
  const generatePlaidToken = async () => {
    try {
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
      })
      const { link_token } = await response.json()
      return link_token
    } catch (error) {
      console.error("Error generating Plaid token:", error)
      throw error
    }
  }

  const onSuccess = useCallback(async (publicToken: string, metadata: any) => {
    try {
      setLoading(true)
      // Exchange public token for access token on your backend
      const response = await fetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token: publicToken }),
      })

      if (!response.ok) throw new Error("Failed to exchange token")

      const { access_token, item_id } = await response.json()

      // Save the connected account info to Supabase
      const { error } = await supabase
        .from("bank_accounts")
        .insert({
          user_id: user?.id,
          institution_name: metadata.institution.name,
          institution_id: metadata.institution.id,
          item_id,
          status: "active",
        })

      if (error) throw error

      toast.success("Bank account connected successfully!")
      // Refresh the list of connected accounts
      fetchLinkedAccounts()
    } catch (error) {
      console.error("Error linking bank account:", error)
      toast.error("Failed to connect bank account")
    } finally {
      setLoading(false)
    }
  }, [user])

  const { open, ready } = usePlaidLink({
    token: null, // You'll need to implement token generation
    onSuccess,
    onExit: () => {
      // Handle the case when a user exits the Plaid Link flow
    },
  })

  const handleConnectBank = async () => {
    try {
      setLoading(true)
      const token = await generatePlaidToken()
      // Update the Plaid Link instance with the new token
      open()
    } catch (error) {
      console.error("Error connecting bank:", error)
      toast.error("Failed to initialize bank connection")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Bank Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={handleConnectBank}
            disabled={!ready || loading}
            className="w-full"
          >
            {loading ? "Connecting..." : "Connect a Bank Account"}
          </Button>

          {linkedAccounts.length > 0 ? (
            <div className="space-y-2">
              {linkedAccounts.map((account: any) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{account.institution_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Connected {new Date(account.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No bank accounts connected yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 