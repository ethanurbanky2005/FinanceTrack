import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="email-notifications" />
        <Label htmlFor="email-notifications">Email Notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="push-notifications" />
        <Label htmlFor="push-notifications">Push Notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="sms-notifications" />
        <Label htmlFor="sms-notifications">SMS Notifications</Label>
      </div>
    </div>
  )
}

