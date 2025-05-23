
"use client";

import { useState, type FormEvent, useEffect } from "react";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Icons } from "@/components/icons";

interface CreateListingDialogProps {
  children: React.ReactNode;
}

const allowedSubscriptionsList = [
  // Inteligencia Artificial
  { value: "ChatGPT Plus", label: "OpenAI - ChatGPT Plus", category: "Inteligencia Artificial" },
  { value: "Gemini Advanced", label: "Google - Gemini Advanced", category: "Inteligencia Artificial" },
  { value: "Perplexity Pro", label: "Perplexity - Perplexity Pro", category: "Inteligencia Artificial" },
  { value: "Midjourney Basic", label: "Midjourney - Plan Básico", category: "Inteligencia Artificial" },
  { value: "Midjourney Standard", label: "Midjourney - Plan Estándar", category: "Inteligencia Artificial" },
  { value: "Midjourney Pro", label: "Midjourney - Plan Pro", category: "Inteligencia Artificial" },
  { value: "Poe Subscription", label: "Poe - Suscripción", category: "Inteligencia Artificial" },
  { value: "Claude Pro", label: "Anthropic - Claude Pro", category: "Inteligencia Artificial" },
  // Diseño y Desarrollo
  { value: "Adobe Creative Cloud", label: "Adobe - Creative Cloud", category: "Diseño y Desarrollo" },
  { value: "GitHub Copilot", label: "GitHub - Copilot", category: "Diseño y Desarrollo" },
  { value: "Envato Elements", label: "Envato - Envato Elements", category: "Diseño y Desarrollo" },
  { value: "Freepik Premium", label: "Freepik - Plan Premium", category: "Diseño y Desarrollo" },
  { value: "Canva Pro", label: "Canva - Canva Pro", category: "Diseño y Desarrollo" },
  { value: "Canva for Teams", label: "Canva - Canva para Equipos", category: "Diseño y Desarrollo" },
  { value: "Figma Professional", label: "Figma - Plan Profesional", category: "Diseño y Desarrollo" },
  { value: "Figma Organization", label: "Figma - Plan Organización", category: "Diseño y Desarrollo" },
  { value: "JetBrains All Products Pack", label: "JetBrains - All Products Pack", category: "Diseño y Desarrollo" },
  // Streaming y Entretenimiento
  { value: "Disney+", label: "Disney+", category: "Streaming y Entretenimiento" },
  { value: "Amazon Prime Video", label: "Amazon Prime Video", category: "Streaming y Entretenimiento" },
  { value: "Max", label: "Max (antes HBO Max)", category: "Streaming y Entretenimiento" },
  { value: "Paramount+", label: "Paramount+", category: "Streaming y Entretenimiento" },
  { value: "Star+", label: "Star+", category: "Streaming y Entretenimiento" },
  { value: "Apple TV+", label: "Apple TV+", category: "Streaming y Entretenimiento" },
  { value: "Crunchyroll Mega Fan", label: "Crunchyroll - Plan Mega Fan", category: "Streaming y Entretenimiento" },
  { value: "Vix Premium", label: "Vix Premium", category: "Streaming y Entretenimiento" },
  { value: "YouTube Premium Individual", label: "YouTube Premium - Individual", category: "Streaming y Entretenimiento" },
  { value: "YouTube Premium Familiar", label: "YouTube Premium - Familiar", category: "Streaming y Entretenimiento" },
  { value: "Spotify Individual", label: "Spotify - Individual", category: "Streaming y Entretenimiento" },
  { value: "Spotify Duo", label: "Spotify - Dúo", category: "Streaming y Entretenimiento" },
  { value: "Spotify Familiar", label: "Spotify - Familiar", category: "Streaming y Entretenimiento" },
  { value: "Apple Music Individual", label: "Apple Music - Individual", category: "Streaming y Entretenimiento" },
  { value: "Apple Music Familiar", label: "Apple Music - Familiar", category: "Streaming y Entretenimiento" },
  { value: "Tidal HiFi", label: "Tidal - HiFi", category: "Streaming y Entretenimiento" },
  { value: "Tidal HiFi Plus", label: "Tidal - HiFi Plus", category: "Streaming y Entretenimiento" },
];

const categories = Array.from(new Set(allowedSubscriptionsList.map(sub => sub.category)));

export function CreateListingDialog({ children }: CreateListingDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [externalUsername, setExternalUsername] = useState("");
  const [externalPassword, setExternalPassword] = useState("");
  const [desiredPricePerSlot, setDesiredPricePerSlot] = useState("");
  const [totalSlots, setTotalSlots] = useState("");
  const [confirm2FA, setConfirm2FA] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, userProfile } = useAuth(); // Changed from user to userProfile for sharerName and avatar

  const resetForm = () => {
    setSelectedPlatform("");
    setExternalUsername("");
    setExternalPassword("");
    setDesiredPricePerSlot("");
    setTotalSlots("");
    setConfirm2FA(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !userProfile) {
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
    if (!selectedPlatform || !externalUsername || !externalPassword || !desiredPricePerSlot || !totalSlots) {
        toast({
            title: "Missing Fields",
            description: "Please fill out all required fields.",
            variant: "destructive",
        });
        return;
    }

    setIsSubmitting(true);

    // For iconUrl, using a placeholder based on the first letter of the selected platform name
    const serviceInitial = selectedPlatform ? selectedPlatform.substring(0,1).toUpperCase() : 'S';
    const iconUrl = `https://placehold.co/64x64.png?text=${serviceInitial}`;

    const newListingData = {
      serviceName: selectedPlatform,
      externalUsername: externalUsername, 
      pricePerSpot: parseFloat(desiredPricePerSlot), 
      totalSpots: parseInt(totalSlots),
      spotsAvailable: parseInt(totalSlots), 
      sharerId: user.uid, 
      status: "Recruiting", 
      iconUrl: iconUrl, 
      createdAt: serverTimestamp(),
      sharerName: userProfile.alias || userProfile.displayName || "Usuario", 
      sharerAvatar: userProfile.photoURL || `https://placehold.co/40x40.png?text=${userProfile.alias?.substring(0,1) || 'U'}`,
      ownerReputation: null, 
      totalRatings: 0,
      isActive: true, 
      popularity: Math.floor(Math.random() * 100), // Assign random popularity for now
    };

    try {
      await addDoc(collection(db, "listings"), newListingData);
      
      toast({
        title: "Listing Submitted!",
        description: `${selectedPlatform} has been listed. It will appear once data is fetched.`,
      });

      resetForm();
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
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Sharing Listing</DialogTitle>
          <DialogDescription>
            Provide details of the external subscription you want to share from the approved list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
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
            <Label htmlFor="platformName">Platform Name</Label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform} required>
              <SelectTrigger id="platformName">
                <SelectValue placeholder="Select a service to share..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectGroup key={category}>
                    <SelectLabel>{category}</SelectLabel>
                    {allowedSubscriptionsList
                      .filter(sub => sub.category === category)
                      .map(sub => (
                        <SelectItem key={sub.value} value={sub.value}>
                          {sub.label}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="externalUsername">External Platform Username/Email</Label>
            <Input id="externalUsername" type="text" value={externalUsername} onChange={(e) => setExternalUsername(e.target.value)} placeholder="user@example.com" required />
          </div>
          <div>
            <Label htmlFor="externalPassword">External Platform Password</Label>
            <Input id="externalPassword" type="password" value={externalPassword} onChange={(e) => setExternalPassword(e.target.value)} placeholder="••••••••" required />
            <p className="text-xs text-muted-foreground mt-1">This password will be sent to your backend for secure handling and is not stored directly client-side in plain text.</p>
          </div>
          <div>
            <Label htmlFor="desiredPricePerSlot">Price I want to receive per slot (USD per month)</Label>
            <Input id="desiredPricePerSlot" type="number" value={desiredPricePerSlot} onChange={(e) => setDesiredPricePerSlot(e.target.value)} placeholder="5.00" step="0.01" min="0" required />
            <p className="text-xs text-muted-foreground mt-1">Subscribers will see a final price including SuscripGrupo's service fee. Payments via Stripe.</p>
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

          <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-1 z-10"> {/* Ensure footer is visible and has z-index */}
            <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !user || !confirm2FA || !selectedPlatform}>
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
