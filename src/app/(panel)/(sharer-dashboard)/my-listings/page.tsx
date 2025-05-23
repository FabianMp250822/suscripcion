
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit3, Trash2, Users, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CreateListingDialog } from "@/components/sharer/create-listing-dialog";
import { useToast } from "@/hooks/use-toast";

// TODO: Define a proper interface for Listing
interface Listing {
  id: string;
  serviceName: string;
  spotsAvailable: number;
  totalSpots: number;
  pricePerSpot: number; // Sharer's desired price
  status: string;
  icon: string;
  groupId: string;
  // Add other relevant fields that would come from Firestore
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]); // Initial state is empty
  const { toast } = useToast();

  // TODO: Implement actual fetching of listings from Firestore for the logged-in user
  // useEffect(() => {
  //   const fetchListings = async () => {
  //     // Firestore query logic here
  //     // setListings(fetchedData);
  //   };
  //   fetchListings();
  // }, []);

  const handleNewListing = (newListingData: any) => {
    // In a real app, this function would trigger a backend call to save to Firestore.
    // The list would then update via a re-fetch or a Firestore listener.
    // For now, we just show a toast as the UI won't update with mock data anymore.
    console.log("New listing data to be saved to Firestore:", newListingData);
    toast({
      title: "Listing Submitted (Simulated)",
      description: `${newListingData.serviceName} would be saved to Firestore. The list will update once data fetching is implemented.`,
    });
    // DO NOT update local state here: setListings(prevListings => [...prevListings, newListingData]);
    // This line is removed to ensure data is only sourced from Firestore.
  };

  const handleDeleteListing = (listingId: string) => {
    // TODO: Implement Firestore deletion logic
    console.log("Deleting listing (simulated):", listingId);
    setListings(prev => prev.filter(l => l.id !== listingId)); // Temporary UI removal
    toast({
      title: "Listing Deleted (Simulated)",
      description: "The listing would be removed from Firestore.",
      variant: "destructive"
    });
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
          <p className="text-muted-foreground">Manage the subscriptions you are sharing.</p>
        </div>
        <CreateListingDialog onListingCreated={handleNewListing}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Listing
          </Button>
        </CreateListingDialog>
      </div>

      {listings.length > 0 ? (
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
                      className={
                        listing.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' :
                        listing.status === 'Recruiting' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' :
                        listing.status === 'Full' ? 'bg-gray-500/20 text-gray-700 border-gray-500/30' : ''
                      }>
                  {listing.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-2xl font-semibold">${listing.pricePerSpot.toFixed(2)} <span className="text-sm text-muted-foreground">/ desired per spot / month</span></p>
                <p className="text-xs text-muted-foreground mt-1"> (Subscribers will see a final price including a service fee)</p>
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
                <Button variant="secondary" onClick={() => console.log("TODO: Implement Edit for", listing.id)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
                 {/* <Button variant="destructive" size="sm" onClick={() => handleDeleteListing(listing.id)}>
                    <Trash2 className="mr-2 h-3 w-3" /> Delete
                </Button> */}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="md:col-span-2 lg:col-span-3 shadow-lg">
          <CardContent className="p-8 text-center">
            <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No listings yet</h3>
            <p className="text-muted-foreground mb-4">Start sharing a subscription by creating a new listing. Your active listings will appear here once fetched from the database.</p>
            {/* The CreateListingDialog is triggered by the button in the header */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
