import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit3, Trash2, Users, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data
const listings = [
  { id: "l1", serviceName: "Netflix Premium", spotsAvailable: 2, totalSpots: 4, pricePerSpot: 5.99, status: "Active", icon: "https://placehold.co/64x64.png?text=N", groupId: "g1" },
  { id: "l2", serviceName: "Spotify Family", spotsAvailable: 0, totalSpots: 6, pricePerSpot: 3.00, status: "Full", icon: "https://placehold.co/64x64.png?text=S", groupId: "g2" },
  { id: "l3", serviceName: "HBO Max Plan", spotsAvailable: 3, totalSpots: 3, pricePerSpot: 4.50, status: "Recruiting", icon: "https://placehold.co/64x64.png?text=H", groupId: "g3" },
];

export default function MyListingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
          <p className="text-muted-foreground">Manage the subscriptions you are sharing.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="shadow-lg flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <Image src={listing.icon} alt={listing.serviceName} width={64} height={64} className="rounded-lg" data-ai-hint="app logo" />
              <div className="flex-1">
                <CardTitle className="text-xl">{listing.serviceName}</CardTitle>
                <CardDescription>
                  {listing.spotsAvailable} of {listing.totalSpots} spots available
                </CardDescription>
              </div>
              <Badge variant={listing.status === 'Active' ? 'default' : listing.status === 'Full' ? 'secondary' : 'outline'}
                     className={listing.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 
                                listing.status === 'Recruiting' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' : ''}>
                {listing.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-2xl font-semibold">${listing.pricePerSpot.toFixed(2)} <span className="text-sm text-muted-foreground">/ spot / month</span></p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                <span>{listing.totalSpots - listing.spotsAvailable} members joined</span>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild>
                <Link href={`/manage-group/${listing.groupId}`}>
                  <Eye className="mr-2 h-4 w-4" /> Manage
                </Link>
              </Button>
              <Button variant="secondary">
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
         {listings.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3 shadow-lg">
            <CardContent className="p-8 text-center">
              <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No listings yet</h3>
              <p className="text-muted-foreground mb-4">Start sharing a subscription by creating a new listing.</p>
              <Button>Create New Listing</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
