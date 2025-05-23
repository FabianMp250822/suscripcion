
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, ExternalLink, ShoppingCart, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

// Mock data for available groups (sharers' listings)
const availableGroups = [
  { id: "g1", serviceName: "Netflix Ultra HD Plan", spotsAvailable: 1, totalSpots: 4, pricePerSpot: 6.50, status: "Recruiting", icon: "https://placehold.co/64x64.png?text=N", sharerName: "Bob The Sharer", sharerAvatar: "https://placehold.co/40x40.png?text=BS" },
  { id: "g2", serviceName: "Spotify Premium Family", spotsAvailable: 3, totalSpots: 6, pricePerSpot: 2.75, status: "Recruiting", icon: "https://placehold.co/64x64.png?text=S", sharerName: "Alice Listswell", sharerAvatar: "https://placehold.co/40x40.png?text=AL" },
  { id: "g3", serviceName: "HBO Max Standard", spotsAvailable: 0, totalSpots: 3, pricePerSpot: 5.00, status: "Full", icon: "https://placehold.co/64x64.png?text=H", sharerName: "Charlie Streamer", sharerAvatar: "https://placehold.co/40x40.png?text=CS" },
  { id: "g4", serviceName: "Disney+ Bundle", spotsAvailable: 2, totalSpots: 5, pricePerSpot: 4.20, status: "Recruiting", icon: "https://placehold.co/64x64.png?text=D", sharerName: "Diana Shares", sharerAvatar: "https://placehold.co/40x40.png?text=DS" },
  { id: "g5", serviceName: "YouTube Premium Family", spotsAvailable: 4, totalSpots: 6, pricePerSpot: 3.50, status: "Active", icon: "https://placehold.co/64x64.png?text=YT", sharerName: "Edward Vids", sharerAvatar: "https://placehold.co/40x40.png?text=EV" },
];

export default function BrowseGroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Shared Groups</h1>
        <p className="text-muted-foreground">Find and join shared subscription groups.</p>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search for services (e.g., Netflix, Spotify...)" className="pl-10" />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
            </div>
        </CardContent>
      </Card>

      {availableGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableGroups.map((group) => (
            <Card key={group.id} className="shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Image src={group.icon} alt={group.serviceName} width={64} height={64} className="rounded-lg" data-ai-hint="app logo" />
                <div className="flex-1">
                  <CardTitle className="text-xl">{group.serviceName}</CardTitle>
                  <CardDescription>
                    Shared by: {group.sharerName}
                  </CardDescription>
                </div>
                <Badge 
                  variant={group.status === 'Active' || group.status === 'Recruiting' ? 'default' : group.status === 'Full' ? 'secondary' : 'outline'}
                  className={
                    group.status === 'Active' || group.status === 'Recruiting' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 
                    group.status === 'Full' ? 'bg-gray-500/20 text-gray-700 border-gray-500/30' : ''
                  }
                >
                  {group.status === 'Full' ? 'Full' : `${group.spotsAvailable} spot${group.spotsAvailable !== 1 ? 's' : ''} left`}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-2xl font-semibold">${group.pricePerSpot.toFixed(2)} <span className="text-sm text-muted-foreground">/ spot / month</span></p>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{group.totalSpots - group.spotsAvailable} / {group.totalSpots} members</span>
                </div>
                 <div className="mt-2 flex items-center">
                    <Image src={group.sharerAvatar} alt={group.sharerName} width={24} height={24} className="rounded-full mr-2" data-ai-hint="profile avatar" />
                    <span className="text-xs text-muted-foreground">Sharer: {group.sharerName}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={group.status === 'Full' || group.spotsAvailable === 0}>
                   {group.status === 'Full' || group.spotsAvailable === 0 ? <Users className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                  {group.status === 'Full' || group.spotsAvailable === 0 ? 'Group Full' : 'View Details & Join'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Groups Found</h3>
              <p className="text-muted-foreground mb-4">There are currently no shared groups available that match your criteria, or no groups listed yet.</p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
