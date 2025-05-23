
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
  // Payment History now moved to a general path, but still only relevant for subscribers from sidebar
  { href: "/payment-history", label: "Payment History", icon: Icons.PaymentHistory, allowedRoles: ["subscriber"], segment: "payment-history" }, 
  // All logged-in users
  { href: "/browse-groups", label: "Browse Groups", icon: Icons.BrowseGroups, allowedRoles: ["admin", "sharer", "subscriber"], segment: "browse-groups"},
  { href: "/messages", label: "Messages", icon: Icons.Messages, allowedRoles: ["admin", "sharer", "subscriber"], segment: "messages"},
  { href: "/my-disputes", label: "My Disputes", icon: Icons.MyDisputes, allowedRoles: ["sharer", "subscriber"], segment: "my-disputes" },
  // Placeholder for future global user settings/profile page
  // { href: "/account-settings", label: "Account Settings", icon: Icons.UserCircle, allowedRoles: ["admin", "sharer", "subscriber"], segment: "account-settings"},
];

interface PanelLayoutClientProps {
  children: ReactNode;
}

export default function PanelLayoutClient({ children }: PanelLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin, isSharer, isSubscriber } = useAuth();

  useEffect(() => {
    // Allow access to specific public-like panel pages even if not fully logged in or roles not determined
    const publicPanelPaths = ["/do-not-sell", "/terms-of-service", "/privacy-policy"];
    if (publicPanelPaths.includes(pathname)) {
      return;
    }

    if (!loading && !user && pathname !== "/login") {
      router.replace("/login");
    }
    if (!loading && user && pathname === "/login") {
        if (isAdmin) router.replace("/users"); // Admin default
        else if (isSharer) router.replace("/my-listings"); // Sharer default
        else router.replace("/browse-groups"); // Subscriber default
    }
  }, [user, loading, router, pathname, isAdmin, isSharer]);


  // For public panel paths, we might not want to show the full loading skeleton, or handle it differently
  const publicPanelPaths = ["/do-not-sell", "/terms-of-service", "/privacy-policy"];
  if (publicPanelPaths.includes(pathname)) {
     // Render children directly for these paths, assuming they don't need the full sidebar/auth context for their core content
     // Or, provide a simpler layout if needed
  } else if (loading || (!user && pathname !== "/login")) {
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
  
  // If it's the login page or specific public panel pages, render children without the sidebar structure.
  if (pathname === "/login" || publicPanelPaths.includes(pathname)) {
    return <>{children}</>;
  }


  const currentUserRoles: ("admin" | "sharer" | "subscriber")[] = [];
  if (isAdmin) {
    currentUserRoles.push("admin");
    // Admins can also browse groups, so add subscriber role for that nav item.
    // This is a bit of a hack; better role/permission system would be ideal.
    // For nav filtering, if they are admin, they can see admin items.
    // For common items like "Browse Groups", admin is already included in allowedRoles.
  } else {
    if (isSharer) {
      currentUserRoles.push("sharer");
    }
    // A user is subscriber if they are not admin and have the subscriber role,
    // or if they are a sharer (sharers are also subscribers)
    // or if they have no other specific roles (defaulting to subscriber).
    if (isSubscriber || isSharer || (!isAdmin && !isSharer && !isSubscriber)) { // ensure default non-admin is subscriber for nav
       currentUserRoles.push("subscriber");
    }
  }
   // Fallback for users who might not have roles set yet but are authenticated and not admin
  if (user && currentUserRoles.length === 0 && !isAdmin) {
    currentUserRoles.push("subscriber"); // Default to subscriber
    if (isSharer) currentUserRoles.push("sharer"); 
  }


  const accessibleNavItems = navItems.filter(item => {
    if (item.allowedRoles.length === 0) return true; // Item accessible to all authenticated users
    if (isAdmin && item.allowedRoles.includes("admin")) return true; // Admin sees admin items
    // For non-admins, check if any of their roles match the item's allowed roles
    return item.allowedRoles.some(role => currentUserRoles.includes(role));
  });

  const getActiveSegment = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
        // Specific logic for "Manage Group" under "My Listings" for Sharers
        if (segments[0] === 'manage-group' && segments.length > 1 && isSharer) {
            return 'my-listings';
        }
        return segments[0];
    }
    return "";
  }
  const activeSegment = getActiveSegment();

  const isLinkActive = (item: NavItem) => {
    if (item.segment) {
      return activeSegment === item.segment;
    }
    // Fallback for exact path match if segment isn't defined or doesn't match
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
