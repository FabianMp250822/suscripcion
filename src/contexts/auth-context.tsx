
"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean; // Example role, expand as needed
  isSharer: boolean;
  isSubscriber: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Placeholder role logic, replace with actual role determination from user claims or Firestore
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSharer, setIsSharer] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Simulate role fetching, replace with actual logic
        // For example, check custom claims or a user document in Firestore
        // This is a simplified example
        if (currentUser.email?.includes('admin')) {
          setIsAdmin(true);
          setIsSharer(false);
          setIsSubscriber(false);
        } else if (currentUser.email?.includes('sharer')) {
          setIsAdmin(false);
          setIsSharer(true);
          setIsSubscriber(false);
        } else {
          setIsAdmin(false);
          setIsSharer(false);
          setIsSubscriber(true);
        }
      } else {
        setIsAdmin(false);
        setIsSharer(false);
        setIsSubscriber(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // You can render a global loading spinner here if desired
    // For now, we render children immediately or a simple loader.
    // This loading state is primarily for the AuthProvider itself.
    // Page-level loading should be handled by Suspense or similar.
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[250px] ml-4" />
      </div>
    );
  }
  

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isSharer, isSubscriber }}>
      {children}
    </AuthContext.Provider>
  );
}
