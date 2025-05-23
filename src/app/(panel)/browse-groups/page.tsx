"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, ShoppingCart, Filter, Star, Loader2, Settings2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { db } from "@/lib/firebase/config";
import { collection, query, where, orderBy, limit, getDocs, type DocumentData, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth"; 
import { GroupDetailsDialog } from "@/components/group-details-dialog";

interface GroupListing {
  id: string;
  serviceName: string;
  spotsAvailable: number;
  totalSpots: number;
  pricePerSpot: number; 
  listingDescription?: string; // Added description
  status: string; 
  iconUrl: string;
  sharerName?: string;
  sharerAvatar?: string;
  ownerReputation?: number;
  totalRatings?: number;
  createdAt?: Timestamp;
  sharerId?: string; 
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
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("spotsAvailable", ">", 0), 
          orderBy("createdAt", "desc"), // Fallback sort
          // Consider adding orderBy("ownerReputation", "desc") if the field is reliable
          limit(50) 
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedListings: GroupListing[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as DocumentData;
          const sharerPrice = data.pricePerSpot || 0;
          const serviceFeePercentage = 0.15; 
          const serviceFee = sharerPrice * serviceFeePercentage; 
          const finalPrice = sharerPrice + serviceFee;

          fetchedListings.push({ 
            id: doc.id, 
            serviceName: data.serviceName || "N/A",
            spotsAvailable: data.spotsAvailable || 0,
            totalSpots: data.totalSpots || 0,
            pricePerSpot: finalPrice,
            listingDescription: data.listingDescription || "", // Get description
            status: data.status || "Unknown",
            iconUrl: data.iconUrl || `https://placehold.co/64x64.png?text=${(data.serviceName || "S").substring(0,1)}`,
            sharerName: data.sharerName || "Usuario",
            sharerAvatar: data.sharerAvatar || 'https://placehold.co/40x40.png?text=S',
            ownerReputation: data.ownerReputation,
            totalRatings: data.totalRatings,
            createdAt: data.createdAt,
            sharerId: data.sharerId, 
          } as GroupListing);
        });
        setAvailableGroups(fetchedListings);
      } catch (error) {
        console.error("Error fetching listings for browsing: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);


  const filteredGroups = availableGroups.filter(group => 
    group.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <Input 
                      placeholder="Search for services (e.g., Netflix, Spotify...)" 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" disabled>
                    <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
            </div>
        </CardContent>
      </Card>

      {loading ? (
         <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const isOwnListing = !!user && group.sharerId === user.uid;
            const buttonDisabled = group.status === 'Full' || group.spotsAvailable === 0 || isOwnListing;

            return (
              <Card key={group.id} className="shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <Image src={group.iconUrl || `https://placehold.co/64x64.png?text=${group.serviceName.substring(0,1)}`} alt={group.serviceName} width={64} height={64} className="rounded-lg object-contain" data-ai-hint="app logo" />
                  <div className="flex-1">
                    <CardTitle className="text-xl">{group.serviceName}</CardTitle>
                    <CardDescription>
                      Shared by: {group.sharerName || "Usuario"}
                      {isOwnListing && <Badge variant="secondary" className="ml-2">Your Listing</Badge>}
                    </CardDescription>
                    <div className="mt-1">
                      <StarRating rating={group.ownerReputation} totalRatings={group.totalRatings} />
                    </div>
                  </div>
                  <Badge 
                    variant={group.status === 'Recruiting' ? 'default' : group.status === 'Full' ? 'secondary' : 'outline'}
                    className={
                      group.status === 'Recruiting' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' : 
                      group.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' :
                      group.status === 'Full' || group.spotsAvailable === 0 ? 'bg-destructive/20 text-destructive border-destructive/30' : ''
                    }
                  >
                    {group.status === 'Full' || group.spotsAvailable === 0 ? 'Full' : `${group.spotsAvailable} spot${group.spotsAvailable !== 1 ? 's' : ''} left`}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-semibold">${(group.pricePerSpot ?? 0).toFixed(2)} <span className="text-sm text-muted-foreground">/ spot / month</span></p>
                  <p className="text-xs text-muted-foreground mt-1">(Final price. Includes SuscripGrupo service fee. Breakdown shown before payment.)</p>
                  {group.listingDescription && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3" title={group.listingDescription}>
                      <strong>Details:</strong> {group.listingDescription}
                    </p>
                  )}
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{group.totalSpots - group.spotsAvailable} / {group.totalSpots} members</span>
                  </div>
                  <div className="mt-2 flex items-center">
                      <Image src={group.sharerAvatar || 'https://placehold.co/40x40.png?text=S'} alt={group.sharerName || "Sharer"} width={24} height={24} className="rounded-full mr-2" data-ai-hint="profile avatar" />
                      <span className="text-xs text-muted-foreground">Sharer: {group.sharerName || "Usuario"}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {isOwnListing ? (
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      asChild
                    >
                      <Link href={`/manage-group/${group.id}`}>
                        <Settings2 className="mr-2 h-4 w-4" />
                        Manage Your Listing
                      </Link>
                    </Button>
                  ) : (
                    <GroupDetailsDialog group={group}>
                      <Button 
                        className="w-full" 
                        disabled={buttonDisabled}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {group.status === 'Full' || group.spotsAvailable === 0 ? 'Group Full' : 'View Details & Join'}
                      </Button>
                    </GroupDetailsDialog>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
         <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Groups Found</h3>
              <p className="text-muted-foreground mb-4">There are currently no shared groups available, or none match your search criteria.</p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
