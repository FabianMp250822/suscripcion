
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, ShoppingCart, Filter, Star } from "lucide-react"; // Added Star
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

// TODO: Define a proper interface for GroupListing that matches Firestore data
interface GroupListing {
  id: string;
  serviceName: string;
  spotsAvailable: number;
  totalSpots: number;
  pricePerSpot: number; // FINAL PRICE for subscriber
  status: string;
  iconUrl: string;
  sharerName: string;
  sharerAvatar: string;
  ownerReputation?: number; // Optional, from 0 to 5
  totalRatings?: number;
  // Add other relevant fields from Firestore
}

const StarRating = ({ rating, totalRatings }: { rating?: number; totalRatings?: number }) => {
  if (typeof rating !== 'number' || rating < 0) {
    return <p className="text-xs text-muted-foreground">Sin calificaciones</p>;
  }
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && <Star key="half" className="h-4 w-4 text-yellow-400 fill-yellow-200" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
      ))}
      {totalRatings !== undefined && <span className="ml-1 text-xs text-muted-foreground">({totalRatings})</span>}
    </div>
  );
};


export default function BrowseGroupsPage() {
  const [availableGroups, setAvailableGroups] = useState<GroupListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch dynamic data from Firestore for 'listings' or 'groups' collection
    // Remember to implement filtering and sorting based on search, filters, and ownerReputation
    // For now, page will show "No Groups Found" as mock data is removed.
    const fetchListings = async () => {
        // Example:
        // const listingsRef = collection(db, "listings");
        // const q = query(listingsRef, where("status", "==", "Recruiting"), orderBy("ownerReputation", "desc"));
        // const snapshot = await getDocs(q);
        // const fetchedListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupListing));
        // setAvailableGroups(fetchedListings);
        setLoading(false);
    }
    fetchListings();
  }, []);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Shared Groups</h1>
        <p className="text-muted-foreground">Find and join shared subscription groups. Payments processed via Stripe.</p>
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

      {loading ? (
         <div className="text-center py-10">
            <Icons.Logo className="mx-auto h-12 w-12 text-muted-foreground animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando grupos...</p>
          </div>
      ) : availableGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableGroups.map((group) => (
            <Card key={group.id} className="shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Image src={group.iconUrl} alt={group.serviceName} width={64} height={64} className="rounded-lg" data-ai-hint="app logo" />
                <div className="flex-1">
                  <CardTitle className="text-xl">{group.serviceName}</CardTitle>
                  <CardDescription>
                    Shared by: {group.sharerName}
                  </CardDescription>
                   <div className="mt-1">
                    <StarRating rating={group.ownerReputation} totalRatings={group.totalRatings} />
                  </div>
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
                <p className="text-xs text-muted-foreground mt-1">(Final price. Includes SuscripGrupo service fee. Breakdown shown before payment.)</p>
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

    