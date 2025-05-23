
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit3, Eye, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CreateListingDialog } from "@/components/sharer/create-listing-dialog";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/config";
import { collection, query, where, orderBy, onSnapshot, type DocumentData, type Unsubscribe, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Icons } from "@/components/icons";

interface Listing {
  id: string;
  serviceName: string;
  spotsAvailable: number;
  totalSpots: number;
  pricePerSpot: number; // Sharer's desired price
  listingDescription?: string; // Added description
  status: string;
  iconUrl: string;
  sharerId?: string; 
  createdAt?: Timestamp; 
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const listingsRef = collection(db, "listings");
    const q = query(
      listingsRef,
      where("sharerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedListings: Listing[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedListings.push({
          id: doc.id,
          serviceName: data.serviceName || "N/A",
          spotsAvailable: data.spotsAvailable || 0,
          totalSpots: data.totalSpots || 0,
          pricePerSpot: data.pricePerSpot || 0, 
          listingDescription: data.listingDescription || "", // Get description
          status: data.status || "Unknown",
          iconUrl: data.iconUrl || `https://placehold.co/64x64.png?text=${(data.serviceName || "S").substring(0,1)}`,
          sharerId: data.sharerId,
          createdAt: data.createdAt,
        } as Listing);
      });
      setListings(fetchedListings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching listings: ", error);
      toast({
        title: "Error Fetching Listings",
        description: "Could not load your listings. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [user, toast]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
          <p className="text-muted-foreground">Manage the subscriptions you are sharing.</p>
        </div>
        <CreateListingDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Listing
          </Button>
        </CreateListingDialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="shadow-lg flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Image src={listing.iconUrl} alt={listing.serviceName} width={64} height={64} className="rounded-lg" data-ai-hint="app logo" />
                <div className="flex-1">
                  <CardTitle className="text-xl">{listing.serviceName}</CardTitle>
                  <CardDescription>
                    {listing.spotsAvailable} of {listing.totalSpots} spots available
                  </CardDescription>
                </div>
                <Badge
                    variant={listing.status === 'Recruiting' ? 'default' : listing.status === 'Full' ? 'secondary' : 'outline'}
                    className={
                        listing.status === 'Recruiting' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' :
                        listing.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' :
                        listing.status === 'Full' ? 'bg-gray-500/20 text-gray-700 border-gray-500/30' : ''
                    }
                >
                  {listing.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-2xl font-semibold">${(listing.pricePerSpot ?? 0).toFixed(2)} <span className="text-sm text-muted-foreground">/ desired per spot / month</span></p>
                <p className="text-xs text-muted-foreground mt-1"> (Subscribers will see a final price including a service fee)</p>
                {listing.listingDescription && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3" title={listing.listingDescription}>
                    <strong>Details:</strong> {listing.listingDescription}
                  </p>
                )}
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{listing.totalSpots - listing.spotsAvailable} members joined</span>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2">
                 <Button variant="outline" asChild>
                  <Link href={`/manage-group/${listing.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> Manage
                  </Link>
                </Button>
                <Button variant="secondary" onClick={() => console.log("TODO: Implement Edit for", listing.id)} disabled>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="md:col-span-2 lg:col-span-3 shadow-lg">
          <CardContent className="p-8 text-center">
            <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No listings yet</h3>
            <p className="text-muted-foreground mb-4">Start sharing a subscription by creating a new listing. Your active listings will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
