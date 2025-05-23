"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const router = useRouter();
  const { user, loading, isAdmin, isSharer } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (isAdmin) {
          router.replace("/users");
        } else if (isSharer) {
          router.replace("/my-listings");
        } else {
          router.replace("/my-active-subscriptions");
        }
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router, isAdmin, isSharer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Skeleton className="h-12 w-12 rounded-full bg-primary/20 mb-4" />
      <h1 className="text-2xl font-semibold text-foreground mb-2">Loading Firebase Subscription Hub...</h1>
      <p className="text-muted-foreground">Please wait while we direct you.</p>
      <div className="mt-8 space-y-2 w-full max-w-md">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    </div>
  );
}
