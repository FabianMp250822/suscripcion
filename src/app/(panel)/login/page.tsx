
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const canSubmitSignUp = agreeToTerms && agreeToPrivacy;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!isLogin && !canSubmitSignUp) {
        toast({
            title: "Consent Required",
            description: "You must agree to the Terms of Service and Privacy Policy to sign up.",
            variant: "destructive",
        });
        setLoading(false);
        return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login Successful", description: "Welcome back!" });
        router.push("/");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        if (newUser) {
            const userDocRef = doc(db, "users", newUser.uid);
            let userRoles = ['subscriber', 'sharer'];
            // Simple logic to assign admin role based on email for demo purposes
            if (email.includes('admin')) {
                userRoles = ['admin'];
            }
            await setDoc(userDocRef, {
                uid: newUser.uid,
                email: newUser.email,
                displayName: newUser.displayName || email.split('@')[0],
                photoURL: newUser.photoURL,
                roles: userRoles,
                createdAt: serverTimestamp(),
                // Placeholder for other user preferences or data
            });
        }
        toast({ title: "Sign Up Successful", description: "Your account has been created. Please log in." });
        setIsLogin(true); // Switch to login view after successful sign-up
        // Clear fields for login
        // setEmail("");
        // setPassword("");
        setAgreeToTerms(false);
        setAgreeToPrivacy(false);
      }
    } catch (error: any) {
      console.error("Authentication error:", error.code, error.message);
      let toastTitle = isLogin ? "Login Failed" : "Sign Up Failed";
      let toastDescription = "An unexpected error occurred. Please try again.";

      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found': // Consolidate for login
          case 'auth/wrong-password': // Consolidate for login
            toastDescription = isLogin ?
              "Incorrect email or password. If you don't have an account, please click 'Sign Up' below." :
              "Could not process your request. Please check the details and try again.";
            break;
          case 'auth/email-already-in-use':
            toastDescription = "This email address is already registered. Please try logging in.";
            break;
          case 'auth/weak-password':
            toastDescription = "The password is too weak. It must be at least 6 characters long.";
            break;
          case 'auth/invalid-email':
            toastDescription = "The email address is not valid. Please check and try again.";
            break;
          default:
            toastDescription = error.message || toastDescription;
        }
      } else {
         toastDescription = error.message || toastDescription;
      }
      
      toast({
        title: toastTitle,
        description: toastDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // New user via Google
          let userRoles = ['subscriber', 'sharer'];
          if (user.email && user.email.includes('admin')) { // Simplified admin role assignment
            userRoles = ['admin'];
          }
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
            photoURL: user.photoURL,
            roles: userRoles,
            createdAt: serverTimestamp(),
          });
          toast({ title: "Sign Up Successful", description: "Welcome! Your account has been created." });
        } else {
          // Existing user
          toast({ title: "Login Successful", description: "Welcome back!" });
        }
        router.push("/");
      }
    } catch (error: any) {
      console.error("Google Sign-In error:", error.code, error.message);
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "Could not sign in with Google.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-4">
            <Icons.Logo className="h-16 w-16 text-primary" />
          </Link>
          <CardTitle className="text-3xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>{isLogin ? "Sign in to access your dashboard." : "Sign up to get started with Firebase Subscription Hub."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms} 
                    onCheckedChange={(checked) => setAgreeToTerms(Boolean(checked))}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I accept the{" "}
                      <Link href="/terms-of-service" target="_blank" className="underline text-primary hover:text-primary/80">
                        Terms of Service
                      </Link>
                    </label>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="privacy" 
                    checked={agreeToPrivacy} 
                    onCheckedChange={(checked) => setAgreeToPrivacy(Boolean(checked))}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I accept the{" "}
                      <Link href="/privacy-policy" target="_blank" className="underline text-primary hover:text-primary/80">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <Button 
                type="submit" 
                className="w-full text-base py-3" 
                disabled={loading || (!isLogin && !canSubmitSignUp)}
            >
              {loading && <Icons.Logo className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6 text-base py-3" onClick={handleGoogleSignIn} disabled={loading}>
            {loading && <Icons.Logo className="mr-2 h-4 w-4 animate-spin" />}
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.7 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
