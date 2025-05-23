import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";

export default function SubscriptionsManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">Define and manage subscription tiers and categories.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create New Subscription Tier</CardTitle>
            <CardDescription>Add a new subscription plan to your platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tierName">Tier Name</Label>
              <Input id="tierName" placeholder="e.g., Premium Plan" />
            </div>
            <div>
              <Label htmlFor="price">Price (USD per month)</Label>
              <Input id="price" type="number" placeholder="e.g., 9.99" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Briefly describe this tier and its benefits." />
            </div>
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="feature1" />
                <Label htmlFor="feature1" className="font-normal">Unlimited Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="feature2" />
                <Label htmlFor="feature2" className="font-normal">HD Streaming</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="feature3" />
                <Label htmlFor="feature3" className="font-normal">Ad-free Experience</Label>
              </div>
            </div>
            <Button className="w-full">Create Tier</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Existing Tiers</CardTitle>
            <CardDescription>Manage current subscription plans.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for list of existing tiers */}
            <div className="border border-dashed border-border rounded-md p-8 text-center">
              <p className="text-muted-foreground">No subscription tiers created yet, or list will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
