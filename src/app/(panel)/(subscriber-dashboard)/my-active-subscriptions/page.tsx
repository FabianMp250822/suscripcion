
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CalendarDays, Users, DollarSign, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { RatingDialog } from "@/components/rating-dialog"; // Import the new dialog
import { Icons } from "@/components/icons";

// TODO: Define a proper interface for ActiveSubscription that matches Firestore data
interface ActiveSubscription {
  id: string;
  serviceName: string;
  sharerName: string;
  sharerId: string; // ID of the user who shared the subscription
  groupId: string; // ID of the group/listing document
  renewalDate: string;
  price: number;
  spotsInGroup: string; // e.g., "1 of 4"
  iconUrl: string;
  groupLink: string; // Could be `/manage-group/${groupId}` for sharer, or a specific subscriber view
}


export default function MyActiveSubscriptionsPage() {
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [selectedSubscriptionForRating, setSelectedSubscriptionForRating] = useState<ActiveSubscription | null>(null);

  useEffect(() => {
    // TODO: Fetch dynamic data from Firestore for the current user's active subscriptions
    // This would typically involve querying a 'userSubscriptions' collection or similar
    // For now, page will show "No Active Subscriptions" as mock data is removed.
    const fetchUserSubscriptions = async () => {
        // Example:
        // const subscriptionsRef = collection(db, "userSubscriptions");
        // const q = query(subscriptionsRef, where("userId", "==", currentUser.uid), where("status", "==", "active"));
        // const snapshot = await getDocs(q);
        // const fetchedSubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActiveSubscription));
        // setActiveSubscriptions(fetchedSubs);
        setLoading(false);
    }
    // if (currentUser) fetchUserSubscriptions(); else setLoading(false); // Ensure currentUser is available from useAuth()
    setLoading(false); // Placeholder
  }, []);

  const handleOpenRatingDialog = (subscription: ActiveSubscription) => {
    setSelectedSubscriptionForRating(subscription);
    setIsRatingDialogOpen(true);
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (selectedSubscriptionForRating) {
      console.log(
        "Rating submitted for sharer:", selectedSubscriptionForRating.sharerId,
        "group:", selectedSubscriptionForRating.groupId,
        "Rating:", rating, "stars, Comment:", comment
      );
      // TODO: Implement actual saving of the rating to Firestore
      // This would trigger a Cloud Function to update the sharer's reputation.
    }
    setIsRatingDialogOpen(false);
    setSelectedSubscriptionForRating(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Active Subscriptions</h1>
        <p className="text-muted-foreground">Manage your current subscriptions and view details.</p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Icons.Logo className="mx-auto h-12 w-12 text-muted-foreground animate-spin mb-4" />
          <p className="text-muted-foreground">Cargando tus suscripciones...</p>
        </div>
      ) : activeSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeSubscriptions.map((sub) => (
            <Card key={sub.id} className="shadow-lg flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Image src={sub.iconUrl} alt={sub.serviceName} width={64} height={64} className="rounded-lg" data-ai-hint="app logo" />
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
              <CardFooter className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={sub.groupLink}> 
                    <ExternalLink className="mr-2 h-4 w-4" /> View Group Details
                  </Link>
                </Button>
                {/* Placeholder for rating eligibility logic */}
                <Button variant="secondary" className="w-full" onClick={() => handleOpenRatingDialog(sub)}>
                  <Star className="mr-2 h-4 w-4" /> Rate Sharer
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
              <Link href="/browse-groups"> 
                Browse Available Groups
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
      {selectedSubscriptionForRating && (
        <RatingDialog
          isOpen={isRatingDialogOpen}
          onOpenChange={setIsRatingDialogOpen}
          sharerName={selectedSubscriptionForRating.sharerName}
          serviceName={selectedSubscriptionForRating.serviceName}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}

    