
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/landing");
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Icons.Logo className="h-12 w-12 text-primary animate-spin mb-4" />
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
