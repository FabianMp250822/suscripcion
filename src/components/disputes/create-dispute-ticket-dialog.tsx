
"use client";

import { useState, type FormEvent, type ReactNode, ChangeEvent } from "react";
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
import { PlusCircle, Loader2, UploadCloud, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase/config"; // Assuming 'auth' is exported for storage rules if needed, though storage sdk handles it.
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image"; // For image preview

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
  const [otherPartyIdentifier, setOtherPartyIdentifier] = useState("");
  const [listingId, setListingId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);


  const participantReasons: DisputeReasonParticipant[] = ["Access Revoked Injustamente", "Credenciales Inválidas o Cambiadas", "Servicio No Corresponde a lo Ofertado"];
  const ownerReasons: DisputeReasonOwner[] = ["Abuso de la Suscripción", "Comportamiento Inapropiado del Usuario", "Pago No Recibido"];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "Archivo Demasiado Grande", description: "Por favor, sube una imagen de menos de 5MB.", variant: "destructive" });
        setSelectedFile(null);
        setFilePreview(null);
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({ title: "Tipo de Archivo Inválido", description: "Por favor, sube un archivo de imagen (ej. JPG, PNG).", variant: "destructive" });
        setSelectedFile(null);
        setFilePreview(null);
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const resetForm = () => {
    setReportingAs("");
    setReason("");
    setDescription("");
    setOtherPartyIdentifier("");
    setListingId("");
    setServiceName("");
    setSelectedFile(null);
    setFilePreview(null);
    setUploadProgress(0);
  };

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
    let evidenceData: { fileName: string, url: string }[] = [];

    try {
      if (selectedFile) {
        const storage = getStorage();
        const uniqueFileName = `${Date.now()}-${selectedFile.name}`;
        const fileStorageRef = storageRef(storage, `disputes_evidence/${user.uid}/${uniqueFileName}`);
        
        const uploadTask = uploadBytesResumable(fileStorageRef, selectedFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Error uploading file: ", error);
              toast({
                title: "Error al Subir Evidencia",
                description: `No se pudo subir el archivo: ${error.message}`,
                variant: "destructive",
              });
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                evidenceData.push({ fileName: uniqueFileName, url: downloadURL });
                resolve();
              } catch (error) {
                 console.error("Error getting download URL: ", error);
                 toast({
                    title: "Error al Obtener URL de Evidencia",
                    description: "No se pudo obtener la URL del archivo subido.",
                    variant: "destructive",
                  });
                reject(error);
              }
            }
          );
        });
      }

      const initiatedBy = {
        id: user.uid,
        name: userProfile.alias || user.displayName || "Usuario Desconocido",
        role: reportingAs as DisputePartyRole,
      };

      const accusedParty = {
          id: otherPartyIdentifier,
          name: `Usuario/Publicación: ${otherPartyIdentifier}`,
          role: reportingAs === "Participant" ? "Owner" : "Participant",
      };

      const disputeDocData = {
        initiatedBy,
        accusedParty,
        listingId: listingId || null,
        serviceName: serviceName || otherPartyIdentifier,
        reason,
        description,
        status: "New" as const, // Ensure type correctness
        dateCreated: serverTimestamp(),
        lastUpdate: serverTimestamp(),
        evidence: evidenceData,
        communicationLog: [],
        adminNotes: "",
      };

      await addDoc(collection(db, "disputes"), disputeDocData);
      toast({
        title: "Ticket de Disputa Creado",
        description: "Tu disputa ha sido enviada para revisión.",
      });
      setIsOpen(false);
      resetForm();

    } catch (error) {
      console.error("Error creating dispute ticket or uploading file: ", error);
      // Error toasts are handled within the upload promise or if general addDoc fails
      if (!(error instanceof Error && error.message.includes("upload")) && !(error instanceof Error && error.message.includes("URL"))) {
         toast({
            title: "Error al Crear Disputa",
            description: "No se pudo enviar tu disputa. Por favor, inténtalo de nuevo.",
            variant: "destructive",
          });
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const currentReasons = reportingAs === "Participant" ? participantReasons : reportingAs === "Owner" ? ownerReasons : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
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
              <SelectTrigger id="reportingAs"><SelectValue placeholder="Selecciona tu rol..." /></SelectTrigger>
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
                placeholder="Ej: ID de usuario, ID de publicación" 
                required 
            />
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
            <Label htmlFor="evidenceUpload">Adjuntar Evidencia (Imagen, máx. 5MB)</Label>
            <Input 
              id="evidenceUpload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {filePreview && (
              <div className="mt-2 p-2 border rounded-md inline-block relative">
                <Image src={filePreview} alt="Vista previa de evidencia" width={100} height={100} className="object-contain rounded" />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => { setSelectedFile(null); setFilePreview(null); const el = document.getElementById('evidenceUpload') as HTMLInputElement; if(el) el.value = ""; }}
                >
                  X
                </Button>
              </div>
            )}
            {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2 text-sm text-muted-foreground">Subiendo: {Math.round(uploadProgress)}%</div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !user || !reportingAs || !reason || !description || !otherPartyIdentifier}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {isSubmitting ? (selectedFile ? "Subiendo y Enviando..." : "Enviando...") : "Enviar Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
