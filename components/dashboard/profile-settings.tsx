"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"

export function ProfileSettings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "",
    email: user?.email || "",
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.fullName,
        })
        .eq("id", user?.id)

      if (error) throw error
      toast.success("Profile updated successfully!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || "", {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success("Password reset email sent!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={profile.fullName}
          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          placeholder="Enter your full name"
        />
      </div>

      <div className="flex flex-col space-y-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={handlePasswordReset}
          disabled={loading}
        >
          Reset Password
        </Button>
      </div>
    </form>
  )
}

