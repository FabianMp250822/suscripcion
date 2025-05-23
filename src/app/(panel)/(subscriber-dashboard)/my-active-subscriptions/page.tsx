import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CalendarDays, Users, DollarSign, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Mock data
const activeSubscriptions = [
  { id: "sub1", serviceName: "Netflix Premium", sharerName: "Bob The Builder", renewalDate: "2023-07-15", price: 5.99, spotsInGroup: "1 of 4", icon: "https://placehold.co/64x64.png?text=N", groupLink: "/manage-group/g1" },
  { id: "sub2", serviceName: "Spotify Duo", sharerName: "Edward Elric", renewalDate: "2023-07-20", price: 3.00, spotsInGroup: "1 of 2", icon: "https://placehold.co/64x64.png?text=S", groupLink: "/manage-group/g2" },
];

export default function MyActiveSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Active Subscriptions</h1>
        <p className="text-muted-foreground">Manage your current subscriptions and view details.</p>
      </div>

      {activeSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeSubscriptions.map((sub) => (
            <Card key={sub.id} className="shadow-lg flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Image src={sub.icon} alt={sub.serviceName} width={64} height={64} className="rounded-lg" data-ai-hint="app logo" />
                <div className="flex-1">
                  <CardTitle className="text-xl">{sub.serviceName}</CardTitle>
                  <CardDescription>Shared by: {sub.sharerName}</CardDescription>
                </div>
                <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30">
                  <CheckCircle className="mr-1 h-3 w-3" /> Active
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <div className="flex items-center text-sm">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>${sub.price.toFixed(2)} / month</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Renews on: {sub.renewalDate}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Your spot: {sub.spotsInGroup}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={sub.groupLink}> {/* This link might need to point to a subscriber view of the group */}
                    <ExternalLink className="mr-2 h-4 w-4" /> View Group Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Active Subscriptions</h3>
            <p className="text-muted-foreground mb-4">You are not currently subscribed to any shared groups.</p>
            <Button asChild>
              <Link href="/browse-groups"> {/* Placeholder link */}
                Browse Available Groups
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
