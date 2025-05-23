import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Configure dashboard settings and preferences.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general platform configurations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="platformName">Platform Name</Label>
            <Input id="platformName" defaultValue="Firebase Subscription Hub" />
            <p className="text-sm text-muted-foreground">This name will be displayed throughout the platform.</p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable access to the platform for users.
              </p>
            </div>
            <Switch id="maintenanceMode" aria-label="Toggle maintenance mode" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input id="supportEmail" type="email" defaultValue="support@example.com" />
            <p className="text-sm text-muted-foreground">Email address for user support inquiries.</p>
          </div>
          
          <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how admins receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
                <Switch id="newUserSignup" defaultChecked/>
                <Label htmlFor="newUserSignup" className="font-normal">Notify on new user sign-ups</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="newSubscription"/>
                <Label htmlFor="newSubscription" className="font-normal">Notify on new subscription purchases</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="disputeNotification" defaultChecked/>
                <Label htmlFor="disputeNotification" className="font-normal">Notify on payment disputes</Label>
            </div>
            <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" /> Save Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
