import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { NotificationSettings } from "@/components/dashboard/notification-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSettings />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Customize your alert settings</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

