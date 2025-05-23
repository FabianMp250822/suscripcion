
"use client";

import { useState, type FormEvent, type ReactNode } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

interface CreateDisputeTicketDialogProps {
  children: ReactNode; // To wrap the trigger button
}

type DisputePartyRole = "Participant" | "Owner";
type DisputeReasonParticipant = "Access Revoked Injustamente" | "Credenciales Inválidas o Cambiadas" | "Servicio No Corresponde a lo Ofertado";
type DisputeReasonOwner = "Abuso de la Suscripción" | "Comportamiento Inapropiado del Usuario" | "Pago No Recibido";

export function CreateDisputeTicketDialog({ children }: CreateDisputeTicketDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  // Form state
  const [reportingAs, setReportingAs] = useState<DisputePartyRole | "">("");
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [otherPartyIdentifier, setOtherPartyIdentifier] = useState(""); // e.g., User ID, Listing ID, or Service Name
  const [listingId, setListingId] = useState(""); // Optional, depending on context
  const [serviceName, setServiceName] = useState(""); // Optional, if relevant

  const participantReasons: DisputeReasonParticipant[] = ["Access Revoked Injustamente", "Credenciales Inválidas o Cambiadas", "Servicio No Corresponde a lo Ofertado"];
  const ownerReasons: DisputeReasonOwner[] = ["Abuso de la Suscripción", "Comportamiento Inapropiado del Usuario", "Pago No Recibido"];

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !userProfile) {
      toast({ title: "Error", description: "Debes iniciar sesión para crear una disputa.", variant: "destructive" });
      return;
    }
    if (!reportingAs || !reason || !description || !otherPartyIdentifier) {
        toast({ title: "Campos Incompletos", description: "Por favor, completa todos los campos obligatorios.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);

    const initiatedBy = {
      id: user.uid,
      name: userProfile.alias || user.displayName || "Usuario Desconocido",
      role: reportingAs as DisputePartyRole,
    };

    // Placeholder for accused party - this would need more sophisticated logic
    // to look up the user/listing ID provided in otherPartyIdentifier
    const accusedParty = {
        id: otherPartyIdentifier, // This is a simplification. In reality, you'd look up this ID.
        name: `Usuario/Publicación: ${otherPartyIdentifier}`, // Placeholder
        role: reportingAs === "Participant" ? "Owner" : "Participant",
    };

    const disputeData = {
      initiatedBy,
      accusedParty,
      listingId: listingId || null,
      serviceName: serviceName || otherPartyIdentifier, // Fallback if service name not explicit
      reason,
      description,
      status: "New",
      dateCreated: serverTimestamp(),
      lastUpdate: serverTimestamp(),
      evidence: [], // Placeholder for evidence URLs
      communicationLog: [], // Placeholder for communication
      adminNotes: "",
    };

    try {
      await addDoc(collection(db, "disputes"), disputeData);
      toast({
        title: "Ticket de Disputa Creado",
        description: "Tu disputa ha sido enviada para revisión. Recibirás una notificación sobre su progreso.",
      });
      setIsOpen(false);
      // Reset form
      setReportingAs("");
      setReason("");
      setDescription("");
      setOtherPartyIdentifier("");
      setListingId("");
      setServiceName("");
    } catch (error) {
      console.error("Error creating dispute ticket: ", error);
      toast({
        title: "Error al Crear Disputa",
        description: "No se pudo enviar tu disputa. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const currentReasons = reportingAs === "Participant" ? participantReasons : reportingAs === "Owner" ? ownerReasons : [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Ticket de Disputa</DialogTitle>
          <DialogDescription>
            Describe el problema que tienes. Un administrador revisará tu caso.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="reportingAs">Estoy reportando como</Label>
            <Select value={reportingAs} onValueChange={(value) => {setReportingAs(value as DisputePartyRole); setReason("");}}>
              <SelectTrigger id="reportingAs"><SelectValue placeholder="Selecciona tu rol en esta disputa..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Participant">Participante (Me uní a un grupo)</SelectItem>
                <SelectItem value="Owner">Propietario (Compartí una suscripción)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportingAs && (
            <div>
              <Label htmlFor="reason">Motivo de la Disputa</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason"><SelectValue placeholder="Selecciona un motivo..." /></SelectTrigger>
                <SelectContent>
                  {currentReasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="otherPartyIdentifier">Identificador de la Otra Parte o Publicación Afectada</Label>
            <Input 
                id="otherPartyIdentifier" 
                value={otherPartyIdentifier} 
                onChange={(e) => setOtherPartyIdentifier(e.target.value)} 
                placeholder="Ej: ID de usuario, ID de publicación, nombre del servicio" 
                required 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {reportingAs === "Participant" ? "Ingresa el ID del propietario o el nombre de la publicación/servicio." : "Ingresa el ID del participante o el nombre de la publicación/servicio."}
            </p>
          </div>

          <div>
            <Label htmlFor="description">Descripción Detallada del Problema</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica claramente qué sucedió, fechas, y cualquier detalle relevante."
              rows={5}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="evidence">Adjuntar Evidencia (Opcional)</Label>
            <Input id="evidence" type="file" disabled /> 
            <p className="text-xs text-muted-foreground mt-1">
              Capturas de pantalla, confirmaciones, etc. (Funcionalidad de carga no implementada en esta demo).
            </p>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !user || !reportingAs || !reason || !description || !otherPartyIdentifier}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Enviando..." : "Enviar Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
