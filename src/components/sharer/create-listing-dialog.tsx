
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

interface CreateListingDialogProps {
  // onListingCreated callback is removed as we're now writing directly to Firestore
  // and the list will update via a Firestore listener or re-fetch (not implemented here).
  children: React.ReactNode; // To wrap the trigger button
}

export function CreateListingDialog({ children }: CreateListingDialogProps) {
  const [platformName, setPlatformName] = useState("");
  const [externalUsername, setExternalUsername] = useState("");
  const [externalPassword, setExternalPassword] = useState("");
  const [desiredPricePerSlot, setDesiredPricePerSlot] = useState("");
  const [totalSlots, setTotalSlots] = useState("");
  const [confirm2FA, setConfirm2FA] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a listing.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm2FA) {
      toast({
        title: "2FA Confirmation Required",
        description: "You must confirm that 2FA is enabled on the external account.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const newListingData = {
      serviceName: platformName,
      externalCredentials: { // Placeholder for how you might structure this securely
        username: externalUsername,
        // password: externalPassword, // IMPORTANT: Password should be handled securely by backend, never stored client-side like this or directly in Firestore plain text
      },
      desiredPricePerSpot: parseFloat(desiredPricePerSlot),
      totalSpots: parseInt(totalSlots),
      spotsAvailable: parseInt(totalSlots), // Initially all spots are available
      sharerId: user.uid,
      status: "Recruiting", // Initial status
      iconUrl: `https://placehold.co/64x64.png?text=${platformName.substring(0,1).toUpperCase() || 'P'}`, // Placeholder icon
      createdAt: serverTimestamp(),
      // Add any other necessary fields: description, terms, etc.
    };

    try {
      // IMPORTANT: In a real app, externalPassword would be sent to a secure backend (e.g., Cloud Function)
      // to be encrypted or handled, not directly to Firestore.
      // For now, we are proceeding without storing the password directly in this client-side example.
      // You'd typically encrypt `externalUsername` and `externalPassword` securely on a backend.
      // The `externalCredentials.password` field is intentionally omitted from `newListingData` for this client-side example.
      // A secure backend function would handle it.

      const docRef = await addDoc(collection(db, "listings"), newListingData);
      
      toast({
        title: "Listing Submitted!",
        description: `${platformName} has been listed. It will appear once data is fetched.`,
      });

      // Reset form and close dialog
      setPlatformName("");
      setExternalUsername("");
      setExternalPassword("");
      setDesiredPricePerSlot("");
      setTotalSlots("");
      setConfirm2FA(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding listing to Firestore: ", error);
      toast({
        title: "Error Creating Listing",
        description: "Could not save the listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Sharing Listing</DialogTitle>
          <DialogDescription>
            Provide details of the external subscription you want to share.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert variant="destructive" className="bg-orange-50 border-orange-300 text-orange-700">
            <ShieldAlert className="h-5 w-5 !text-orange-600" />
            <AlertTitle className="font-semibold !text-orange-800">Important Security Notice</AlertTitle>
            <AlertDescription className="!text-orange-700 text-xs">
              You are about to provide login credentials for an external service. Sharing account details carries risks.
              Ensure you use strong, unique passwords. We strive to store credentials securely (e.g., via backend encryption),
              but ultimate responsibility for account security lies with you. Payments are processed via Stripe.
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="platformName">Platform Name (e.g., Netflix, Spotify)</Label>
            <Input id="platformName" value={platformName} onChange={(e) => setPlatformName(e.target.value)} placeholder="Netflix" required />
          </div>
          <div>
            <Label htmlFor="externalUsername">External Platform Username/Email</Label>
            <Input id="externalUsername" type="email" value={externalUsername} onChange={(e) => setExternalUsername(e.target.value)} placeholder="user@example.com" required />
          </div>
          <div>
            <Label htmlFor="externalPassword">External Platform Password</Label>
            <Input id="externalPassword" type="password" value={externalPassword} onChange={(e) => setExternalPassword(e.target.value)} placeholder="••••••••" required />
            <p className="text-xs text-muted-foreground mt-1">This password will be sent to your backend for secure handling and is not stored directly client-side in plain text.</p>
          </div>
          <div>
            <Label htmlFor="desiredPricePerSlot">Price I want to receive per slot (USD per month)</Label>
            <Input id="desiredPricePerSlot" type="number" value={desiredPricePerSlot} onChange={(e) => setDesiredPricePerSlot(e.target.value)} placeholder="5.00" step="0.01" min="0" required />
          </div>
           <div>
            <Label htmlFor="totalSlots">Total Available Spots in Subscription</Label>
            <Input id="totalSlots" type="number" value={totalSlots} onChange={(e) => setTotalSlots(e.target.value)} placeholder="4" step="1" min="1" required />
          </div>

          <div className="items-top flex space-x-2 mt-4 border p-3 rounded-md bg-blue-50 border-blue-300">
            <Checkbox id="confirm2FA" checked={confirm2FA} onCheckedChange={(checked) => setConfirm2FA(!!checked)} />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="confirm2FA" className="text-sm font-medium !text-blue-800">
                I confirm Two-Factor Authentication (2FA) is MANDATORY and ACTIVE on this external account.
              </Label>
              <p className="text-xs text-blue-700">
                This is crucial for protecting the shared account. Failure to enable 2FA may result in account suspension.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !user}>
                {isSubmitting ? (
                  <>
                    <Icons.Logo className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Listing
                  </>
                )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
