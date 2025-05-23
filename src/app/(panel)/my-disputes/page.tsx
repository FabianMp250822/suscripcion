
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Eye, Loader2, AlertTriangle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { CreateDisputeTicketDialog } from "@/components/disputes/create-dispute-ticket-dialog";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot, orderBy, or, type Timestamp, type Unsubscribe } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

type DisputePartyRole = "Participant" | "Owner";
type DisputeStatus = "New" | "Pending User Response" | "Pending Admin Review" | "Resolved - Favor User" | "Resolved - Favor Sharer" | "Resolved - Dismissed" | "Escalated";

interface DisputeTicket {
  id: string;
  dateCreated: Timestamp;
  initiatedBy: { id: string, name: string, role: DisputePartyRole };
  accusedParty: { id: string, name: string, role: DisputePartyRole };
  listingId?: string;
  serviceName?: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  lastUpdate?: Timestamp; // Firestore Timestamp
  evidence?: { fileName: string, url: string }[];
  communicationLog?: { userId: string, message: string, timestamp: Timestamp }[];
  adminNotes?: string;
}

const getStatusBadgeVariant = (status: DisputeStatus) => {
  switch (status) {
    case "New": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Pending User Response": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    case "Pending Admin Review": return "bg-orange-500/20 text-orange-700 border-orange-500/30";
    case "Resolved - Favor User":
    case "Resolved - Favor Sharer":
      return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Resolved - Dismissed": return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    case "Escalated": return "bg-red-500/20 text-red-700 border-red-500/30";
    default: return "secondary";
  }
};

export default function MyDisputesPage() {
  const [userDisputes, setUserDisputes] = useState<DisputeTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      // User not logged in, or auth state not yet determined
      return;
    }

    setLoading(true);
    const disputesRef = collection(db, "disputes");
    // Query for disputes where the current user is either the initiator or the accused party
    const q = query(
      disputesRef,
      or(
        where("initiatedBy.id", "==", user.uid),
        where("accusedParty.id", "==", user.uid)
      ),
      orderBy("dateCreated", "desc")
    );

    const unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedDisputes: DisputeTicket[] = [];
      querySnapshot.forEach((doc) => {
        fetchedDisputes.push({ id: doc.id, ...doc.data() } as DisputeTicket);
      });
      setUserDisputes(fetchedDisputes);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user disputes: ", error);
      toast({
        title: "Error al Cargar Disputas",
        description: "No se pudieron cargar tus disputas. Intenta de nuevo más tarde.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [user, toast]);

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "N/A";
    return timestamp.toDate().toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Disputas</h1>
          <p className="text-muted-foreground">Consulta y gestiona tus disputas iniciadas o en las que estás involucrado.</p>
        </div>
        <CreateDisputeTicketDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Disputa
          </Button>
        </CreateDisputeTicketDialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Historial de Disputas</CardTitle>
          <CardDescription>Aquí puedes ver el estado de todas tus disputas.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : userDisputes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Ticket</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Servicio/Publicación</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userDisputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-mono text-xs">{dispute.id}</TableCell>
                    <TableCell>{formatDate(dispute.dateCreated)}</TableCell>
                    <TableCell>{dispute.serviceName || "N/A"}</TableCell>
                    <TableCell className="max-w-[250px] truncate" title={dispute.reason}>{dispute.reason}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(dispute.status)}>{dispute.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        {/* TODO: Link to a detailed dispute view page /my-disputes/[disputeId] */}
                        <Link href={`#`}> 
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 mb-4" />
              No tienes disputas activas o pasadas.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
