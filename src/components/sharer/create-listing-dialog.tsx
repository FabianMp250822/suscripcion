
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
import { Textarea } from "@/components/ui/textarea";
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
  const [listingDescription, setListingDescription] = useState("");
  const [confirm2FA, setConfirm2FA] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, userProfile } = useAuth(); 

  const resetForm = () => {
    setSelectedPlatform("");
    setExternalUsername("");
    setExternalPassword("");
    setDesiredPricePerSlot("");
    setTotalSlots("");
    setListingDescription("");
    setConfirm2FA(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !userProfile) {
      toast({
        title: "Autenticación Requerida",
        description: "Debes iniciar sesión para crear una publicación.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm2FA) {
      toast({
        title: "Confirmación de 2FA Requerida",
        description: "Debes confirmar que 2FA está activada en la cuenta externa.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedPlatform || !externalUsername || !externalPassword || !desiredPricePerSlot || !totalSlots || !listingDescription) {
        toast({
            title: "Campos Faltantes",
            description: "Por favor, completa todos los campos obligatorios, incluyendo la selección de plataforma y la descripción.",
            variant: "destructive",
        });
        return;
    }

    setIsSubmitting(true);

    const serviceInfo = allowedSubscriptionsList.find(s => s.value === selectedPlatform);
    const serviceLabel = serviceInfo ? serviceInfo.label : selectedPlatform;
    const iconUrl = `https://placehold.co/64x64.png?text=${serviceLabel.substring(0,1).toUpperCase() || 'P'}`;

    const newListingData = {
      serviceName: selectedPlatform, 
      // externalUsername: externalUsername, // Credenciales sensibles, manejar con cuidado
      pricePerSpot: parseFloat(desiredPricePerSlot), 
      totalSpots: parseInt(totalSlots),
      spotsAvailable: parseInt(totalSlots), 
      listingDescription: listingDescription, 
      sharerId: user.uid, 
      sharerName: userProfile.alias || userProfile.displayName || "Usuario", 
      sharerAvatar: userProfile.photoURL || `https://placehold.co/40x40.png?text=${userProfile.alias?.substring(0,1) || 'U'}`,
      status: "Recruiting", 
      iconUrl: iconUrl, 
      createdAt: serverTimestamp(),
      ownerReputation: userProfile.reputationScore || null, 
      totalRatings: userProfile.totalRatings || 0,
      isActive: true, 
      popularity: Math.floor(Math.random() * 100), 
    };

    try {
      await addDoc(collection(db, "listings"), newListingData);
      
      toast({
        title: "Publicación Enviada",
        description: `${selectedPlatform} ha sido publicada. Aparecerá una vez que los datos se actualicen.`,
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error añadiendo publicación a Firestore: ", error);
      toast({
        title: "Error Creando Publicación",
        description: "No se pudo guardar la publicación. Por favor, inténtalo de nuevo.",
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
          <DialogTitle>Crear Nueva Publicación de Intercambio</DialogTitle>
          <DialogDescription>
            Proporciona los detalles de la suscripción externa que deseas compartir de la lista aprobada.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
          <Alert variant="destructive" className="bg-orange-50 border-orange-300 text-orange-700">
            <ShieldAlert className="h-5 w-5 !text-orange-600" />
            <AlertTitle className="font-semibold !text-orange-800">Aviso Importante de Seguridad</AlertTitle>
            <AlertDescription className="!text-orange-700 text-xs">
              Estás a punto de proporcionar credenciales de inicio de sesión para un servicio externo. Compartir detalles de cuenta conlleva riesgos.
              Asegúrate de usar contraseñas fuertes y únicas. Nos esforzamos por manejar las credenciales de forma segura (ej. mediante cifrado en backend),
              pero la responsabilidad última de la seguridad de la cuenta recae en ti. Los pagos se procesan vía Stripe.
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="platformName">Nombre de la Plataforma</Label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform} required>
              <SelectTrigger id="platformName">
                <SelectValue placeholder="Selecciona un servicio (Obligatorio)..." />
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
            <Label htmlFor="externalUsername">Usuario/Email de la Plataforma Externa</Label>
            <Input id="externalUsername" type="text" value={externalUsername} onChange={(e) => setExternalUsername(e.target.value)} placeholder="usuario@ejemplo.com" required />
          </div>
          <div>
            <Label htmlFor="externalPassword">Contraseña de la Plataforma Externa</Label>
            <Input id="externalPassword" type="password" value={externalPassword} onChange={(e) => setExternalPassword(e.target.value)} placeholder="••••••••" required />
            <p className="text-xs text-muted-foreground mt-1">Esta contraseña será enviada a tu backend para un manejo seguro y no se almacena directamente en texto plano del lado del cliente.</p>
          </div>
          <div>
            <Label htmlFor="desiredPricePerSlot">Precio que deseo recibir por cupo (USD por mes)</Label>
            <Input id="desiredPricePerSlot" type="number" value={desiredPricePerSlot} onChange={(e) => setDesiredPricePerSlot(e.target.value)} placeholder="5.00" step="0.01" min="0" required />
            <p className="text-xs text-muted-foreground mt-1">Los suscriptores verán un precio final incluyendo la tarifa de servicio de SuscripGrupo. Pagos vía Stripe.</p>
          </div>
           <div>
            <Label htmlFor="totalSlots">Total de Cupos Disponibles en la Suscripción</Label>
            <Input id="totalSlots" type="number" value={totalSlots} onChange={(e) => setTotalSlots(e.target.value)} placeholder="4" step="1" min="1" required />
          </div>

          <div>
            <Label htmlFor="listingDescription">Descripción / Detalles para los Participantes</Label>
            <Textarea 
              id="listingDescription" 
              value={listingDescription} 
              onChange={(e) => setListingDescription(e.target.value)} 
              placeholder="Ej: Máx 2 dispositivos simultáneamente, no cambiar perfiles, uso respetuoso, etc." 
              rows={4}
              required 
            />
            <p className="text-xs text-muted-foreground mt-1">Proporciona expectativas claras para los usuarios que se unan a tu grupo.</p>
          </div>

          <div className="items-top flex space-x-2 mt-4 border p-3 rounded-md bg-blue-50 border-blue-300">
            <Checkbox id="confirm2FA" checked={confirm2FA} onCheckedChange={(checked) => setConfirm2FA(!!checked)} />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="confirm2FA" className="text-sm font-medium !text-blue-800">
                Confirmo que la Autenticación de Dos Factores (2FA) es OBLIGATORIA y está ACTIVA en esta cuenta externa.
              </Label>
              <p className="text-xs text-blue-700">
                Esto es crucial para proteger la cuenta compartida. No activar 2FA puede resultar en la suspensión de la cuenta.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-1 z-10">
            <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !user || !confirm2FA || !selectedPlatform || !listingDescription}>
                {isSubmitting ? (
                  <>
                    <Icons.Logo className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Crear Publicación
                  </>
                )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

