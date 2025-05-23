"use client";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icons } from "@/components/icons"; // For a potential unauthorized message

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/"); // Redirect to a general dashboard or login if not admin
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Icons.Logo className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
     return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Icons.Users className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
