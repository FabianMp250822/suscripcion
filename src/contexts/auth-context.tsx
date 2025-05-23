
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
  isAdmin: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSharer, setIsSharer] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const email = currentUser.email || "";
        const isAdminUser = email.includes('admin');
        const isSharerUser = email.includes('sharer');
        const isSubscriberUser = email.includes('subscriber');

        setIsAdmin(isAdminUser);
        if (isAdminUser) {
            setIsSharer(false);
            setIsSubscriber(false);
        } else {
            setIsSharer(isSharerUser);
            // A user is a subscriber if their email includes 'subscriber'
            // OR if they are not a sharer and not an admin (default role for simple emails)
            setIsSubscriber(isSubscriberUser || (!isSharerUser && !isAdminUser));
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
