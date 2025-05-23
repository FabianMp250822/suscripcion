
"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config"; // Added db
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"; // Added Firestore functions
import { Skeleton } from "@/components/ui/skeleton";

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const roles: string[] = userData.roles || [];

            const hasAdminRole = roles.includes('admin');
            const hasSharerRole = roles.includes('sharer');
            const hasSubscriberRole = roles.includes('subscriber');

            setIsAdmin(hasAdminRole);

            if (hasAdminRole) {
              setIsSharer(false);
              setIsSubscriber(false);
            } else {
              setIsSharer(hasSharerRole);
              setIsSubscriber(hasSubscriberRole || hasSharerRole || roles.length === 0);
            }
          } else {
            // Document doesn't exist, create it with default roles
            console.warn(`User document for ${currentUser.uid} not found in Firestore. Attempting to create it.`);
            const userDocRefToCreate = doc(db, "users", currentUser.uid);
            let newRoles = ['subscriber', 'sharer'];
            if (currentUser.email && currentUser.email.includes('admin')) {
              newRoles = ['admin'];
            }

            await setDoc(userDocRefToCreate, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : "User"),
              photoURL: currentUser.photoURL,
              roles: newRoles,
              createdAt: serverTimestamp(),
            });
            console.log(`Created missing Firestore user document for ${currentUser.uid}`);
            
            // Set roles based on the newly created document
            const isAdminUser = newRoles.includes('admin');
            setIsAdmin(isAdminUser);
            if (isAdminUser) {
              setIsSharer(false);
              setIsSubscriber(false);
            } else {
              setIsSharer(newRoles.includes('sharer'));
              setIsSubscriber(newRoles.includes('subscriber') || newRoles.includes('sharer') || newRoles.length === 0);
            }
          }
        } catch (error) {
          console.error("Error fetching/creating user roles from Firestore:", error);
          setIsAdmin(false);
          setIsSharer(false);
          setIsSubscriber(true); // Default to basic subscriber on error
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsSharer(false);
        setIsSubscriber(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading && !user) { // Show full page skeleton only if user is not yet determined and loading
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="ml-4 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isSharer, isSubscriber }}>
      {children}
    </AuthContext.Provider>
  );
}
