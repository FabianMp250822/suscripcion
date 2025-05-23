
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

interface CreateListingDialogProps {
  onListingCreated: (listingData: any) => void; // Callback after successful creation
  children: React.ReactNode; // To wrap the trigger button
}

export function CreateListingDialog({ onListingCreated, children }: CreateListingDialogProps) {
  const [platformName, setPlatformName] = useState("");
  const [externalUsername, setExternalUsername] = useState("");
  const [externalPassword, setExternalPassword] = useState("");
  const [desiredPricePerSlot, setDesiredPricePerSlot] = useState(""); // Changed from pricePerSlot
  const [totalSlots, setTotalSlots] = useState("");
  const [confirm2FA, setConfirm2FA] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!confirm2FA) {
      toast({
        title: "2FA Confirmation Required",
        description: "You must confirm that 2FA is enabled on the external account.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("New Listing Data (Sharer's perspective):", {
      platformName,
      externalUsername,
      // externalPassword should NOT be logged in production. Sent securely to backend.
      pricePerSpot: parseFloat(desiredPricePerSlot), // This is the sharer's desired price
      totalSlots: parseInt(totalSlots),
      confirm2FA,
    });

    // Simulating API call and response
    // The backend would calculate the final price including service fee.
    // For the frontend simulation, we pass the desired price.
    const newListing = {
      id: `l${Math.floor(Math.random() * 1000)}`, 
      serviceName: platformName,
      spotsAvailable: parseInt(totalSlots), 
      totalSpots: parseInt(totalSlots),
      pricePerSpot: parseFloat(desiredPricePerSlot), // This is the sharer's desired price
      status: "Recruiting", 
      icon: `https://placehold.co/64x64.png?text=${platformName.substring(0,1).toUpperCase() || 'P'}`,
      groupId: `g${Math.floor(Math.random() * 1000)}`, 
    };

    onListingCreated(newListing);
    toast({
      title: "Listing Created (Simulated)",
      description: `${platformName} has been listed for sharing. You set your desired price per slot.`,
    });

    setPlatformName("");
    setExternalUsername("");
    setExternalPassword("");
    setDesiredPricePerSlot("");
    setTotalSlots("");
    setConfirm2FA(false);
    setIsOpen(false);
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
              Ensure you use strong, unique passwords. We strive to store credentials securely (via backend encryption, not yet implemented),
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
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Listing
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    