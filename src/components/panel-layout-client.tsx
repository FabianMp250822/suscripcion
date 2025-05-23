
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Icons } from "./icons";
import { UserNav } from "./user-nav";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  allowedRoles: ("admin" | "sharer" | "subscriber")[];
  segment?: string; // for active state matching
}

const navItems: NavItem[] = [
  // Admin
  { href: "/users", label: "Users", icon: Icons.Users, allowedRoles: ["admin"], segment: "users" },
  { href: "/subscriptions-management", label: "Subscriptions", icon: Icons.Subscriptions, allowedRoles: ["admin"], segment: "subscriptions-management" },
  { href: "/shared-groups", label: "Shared Groups", icon: Icons.SharedGroups, allowedRoles: ["admin"], segment: "shared-groups" },
  { href: "/payment-transactions", label: "Payment Transactions", icon: Icons.AdminPaymentTransactions, allowedRoles: ["admin"], segment: "payment-transactions" },
  { href: "/disputes", label: "Disputes", icon: Icons.Disputes, allowedRoles: ["admin"], segment: "disputes" },
  { href: "/reports", label: "Reports", icon: Icons.Reports, allowedRoles: ["admin"], segment: "reports" },
  { href: "/settings", label: "Admin Settings", icon: Icons.Settings, allowedRoles: ["admin"], segment: "settings" },
  // Sharer
  { href: "/my-listings", label: "My Listings", icon: Icons.MyListings, allowedRoles: ["sharer"], segment: "my-listings" },
  { href: "/earnings", label: "Earnings", icon: Icons.Earnings, allowedRoles: ["sharer"], segment: "earnings" },
  // Subscriber
  { href: "/my-active-subscriptions", label: "Active Subscriptions", icon: Icons.MyActiveSubscriptions, allowedRoles: ["subscriber"], segment: "my-active-subscriptions"},
  { href: "/payment-history", label: "Payment History", icon: Icons.PaymentHistory, allowedRoles: ["subscriber"], segment: "payment-history" },
  // All logged-in users
  { href: "/browse-groups", label: "Browse Groups", icon: Icons.BrowseGroups, allowedRoles: ["admin", "sharer", "subscriber"], segment: "browse-groups"},
  { href: "/messages", label: "Messages", icon: Icons.Messages, allowedRoles: ["admin", "sharer", "subscriber"], segment: "messages"},
  { href: "/my-disputes", label: "My Disputes", icon: Icons.MyDisputes, allowedRoles: ["sharer", "subscriber"], segment: "my-disputes" },
];

interface PanelLayoutClientProps {
  children: ReactNode;
}

export default function PanelLayoutClient({ children }: PanelLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin, isSharer, isSubscriber } = useAuth();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.replace("/login");
    }
    if (!loading && user && pathname === "/login") {
        if (isAdmin) router.replace("/users"); // Default admin page
        else if (isSharer) router.replace("/my-listings"); 
        else router.replace("/browse-groups"); 
    }
  }, [user, loading, router, pathname, isAdmin, isSharer]);

  if (loading || (!user && pathname !== "/login")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Icons.Logo className="w-12 h-12 text-primary mb-4 animate-spin" />
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
          <div className="w-64 mt-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  const currentUserRoles: ("admin" | "sharer" | "subscriber")[] = [];
  if (isAdmin) {
    currentUserRoles.push("admin");
  } else { 
    if (isSharer) {
      currentUserRoles.push("sharer");
    }
    // A user can be a subscriber even if they are also a sharer, or if they are only a subscriber.
    // If they are not admin and have no specific roles from Firestore yet, default to subscriber.
    if (isSubscriber || (!isSharer && !isSubscriber)) { 
      currentUserRoles.push("subscriber");
    }
  }
  // Fallback for users with no specific roles from Firestore yet, but are authenticated (should be rare with current AuthContext logic)
  if (user && currentUserRoles.length === 0 && !isAdmin) {
    currentUserRoles.push("subscriber"); // Default to subscriber if authenticated but no specific roles (excluding admin)
  }


  const accessibleNavItems = navItems.filter(item => {
    if (item.allowedRoles.length === 0) return true; // No roles specified means accessible to all
    return item.allowedRoles.some(role => currentUserRoles.includes(role));
  });
  
  const getActiveSegment = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
        // Specific handling for /manage-group/[groupId] to keep /my-listings active for sharers
        if (segments[0] === 'manage-group' && segments.length > 1 && isSharer) {
            return 'my-listings'; 
        }
        // Specific handling for admin nested routes
        if (currentUserRoles.includes('admin') && segments.length > 0){
            return segments[0];
        }
        return segments[0];
    }
    return "";
  }
  const activeSegment = getActiveSegment();
  
  const isLinkActive = (item: NavItem) => {
    if (item.segment) {
      // For admin, check if the current path starts with the item's href
      // (e.g., /users/detail should make /users active)
      // For non-admins or items without sub-routes, direct segment match is fine.
      if (currentUserRoles.includes('admin') && pathname.startsWith(item.href)) {
         return activeSegment === item.segment;
      }
      return activeSegment === item.segment;
    }
    // Fallback for items without a specific segment, direct href match
    return pathname === item.href;
  };


  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
        <SidebarHeader className="flex items-center justify-between p-2">
          <Link href="/" className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
            <Icons.Logo className="h-7 w-7 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
            <span className="font-semibold text-lg text-primary group-data-[collapsible=icon]:hidden">Subscription Hub</span>
          </Link>
          <div className="md:hidden">
             <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {accessibleNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={isLinkActive(item)}
                    tooltip={{ children: item.label, side: "right", align: "center" }}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          {/* Can add footer items here if needed */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <div className="md:hidden"> 
             <SidebarTrigger />
          </div>
          <div className="flex-1">
            {/* Breadcrumbs or page title can go here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

