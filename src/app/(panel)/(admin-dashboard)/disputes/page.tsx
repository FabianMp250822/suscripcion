
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, CheckCircle, Search, PlayCircle, Gavel, UserCheck, UserX, ShieldQuestion } from "lucide-react";
// import Link from "next/link"; // Not currently used, can be removed or kept for future use
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


type DisputePartyRole = "Participant" | "Owner";
type DisputeStatus = "New" | "Pending User Response" | "Pending Admin Review" | "Resolved - Favor User" | "Resolved - Favor Sharer" | "Resolved - Dismissed" | "Escalated";

interface DisputeTicket {
  id: string;
  dateCreated: string;
  initiatedBy: { id: string, name: string, role: DisputePartyRole };
  accusedParty: { id: string, name: string, role: DisputePartyRole };
  listingId?: string;
  serviceName?: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  lastUpdate: string;
  evidence?: { fileName: string, url: string }[]; 
  communicationLog?: { userId: string, message: string, timestamp: string }[];
  adminNotes?: string;
}

// Data fetching from Firestore will replace this mock data.
// For now, an empty array to ensure the page loads without predefined disputes.
const initialDisputes: DisputeTicket[] = [];


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

const allDisputeStatuses: DisputeStatus[] = ["New", "Pending User Response", "Pending Admin Review", "Resolved - Favor User", "Resolved - Favor Sharer", "Resolved - Dismissed", "Escalated"];


export default function AdminDisputesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [disputes, setDisputes] = useState<DisputeTicket[]>(initialDisputes); // Use initialDisputes
  const [selectedDispute, setSelectedDispute] = useState<DisputeTicket | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatusToSet, setNewStatusToSet] = useState<DisputeStatus | "">("");
  const [currentAdminNotes, setCurrentAdminNotes] = useState("");

  // TODO: Implement useEffect to fetch disputes from Firestore and populate `disputes` state.

  const filteredDisputes = disputes.filter(d =>
    (d.initiatedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.accusedParty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (d.serviceName && d.serviceName.toLowerCase().includes(searchTerm.toLowerCase()))
    ) &&
    (filterStatus === "all" || d.status === filterStatus)
  );

  const handleViewDetails = (dispute: DisputeTicket) => {
    setSelectedDispute(dispute);
    setCurrentAdminNotes(dispute.adminNotes || "");
    setIsDetailsModalOpen(true);
  };

  const handleOpenChangeStatusModal = (dispute: DisputeTicket) => {
    setSelectedDispute(dispute);
    setNewStatusToSet(dispute.status); 
    setCurrentAdminNotes(dispute.adminNotes || "");
    setIsStatusModalOpen(true);
  };

  const handleSaveStatusChange = () => {
    if (selectedDispute && newStatusToSet) {
      // TODO: In a real app, update status in Firestore here
      console.log(`Updating status for ${selectedDispute.id} to ${newStatusToSet} with notes: ${currentAdminNotes}`);
      // For UI update without Firestore for now:
      setDisputes(prevDisputes => prevDisputes.map(d => 
        d.id === selectedDispute.id 
        ? { ...d, status: newStatusToSet as DisputeStatus, adminNotes: currentAdminNotes, lastUpdate: new Date().toISOString().split('T')[0] } 
        : d
      ));
      setIsStatusModalOpen(false);
      setSelectedDispute(null);
    }
  };
  
  const handleQuickResolve = (disputeId: string, resolution: "Favor Initiator" | "Favor Accused") => {
    // TODO: In a real app, update status in Firestore here
    console.log(`Quick resolving dispute ${disputeId}: ${resolution}`);
    const newStatus = resolution === "Favor Initiator" ? "Resolved - Favor User" : "Resolved - Favor Sharer";
     setDisputes(prevDisputes => prevDisputes.map(d => 
        d.id === disputeId 
        ? { ...d, status: newStatus, adminNotes: `${d.adminNotes || ''}\nQuick resolved: ${resolution}.`, lastUpdate: new Date().toISOString().split('T')[0] } 
        : d
      ));
  };

  const handleEscalate = (disputeId: string) => {
    // TODO: In a real app, update status in Firestore here
    console.log(`Escalating dispute ${disputeId}`);
    setDisputes(prevDisputes => prevDisputes.map(d => 
        d.id === disputeId 
        ? { ...d, status: "Escalated", adminNotes: `${d.adminNotes || ''}\nEscalated for further review.`, lastUpdate: new Date().toISOString().split('T')[0] } 
        : d
      ));
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestionar Disputas</h1>
        <p className="text-muted-foreground">Revisar, arbitrar y resolver disputas reportadas por usuarios.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filtrar y Buscar Disputas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, Usuario, Servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="Filtrar por Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              {allDisputeStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Todos los Tickets de Disputa</CardTitle>
          <CardDescription>Lista de todas las disputas reportadas que requieren atención.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Iniciador</TableHead>
                <TableHead>Acusado</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-mono text-xs">{dispute.id}</TableCell>
                  <TableCell>{dispute.dateCreated}</TableCell>
                  <TableCell>{dispute.initiatedBy.name} <Badge variant="outline" className="ml-1 text-xs">{dispute.initiatedBy.role}</Badge></TableCell>
                  <TableCell>{dispute.accusedParty.name} <Badge variant="outline" className="ml-1 text-xs">{dispute.accusedParty.role}</Badge></TableCell>
                  <TableCell>{dispute.serviceName || "N/A"}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={dispute.reason}>{dispute.reason}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(dispute.status)}>{dispute.status}</Badge>
                  </TableCell>
                  <TableCell>{dispute.lastUpdate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(dispute)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalles y Arbitrar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenChangeStatusModal(dispute)}>
                          <Edit className="mr-2 h-4 w-4" /> Cambiar Estado y Notas
                        </DropdownMenuItem>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleQuickResolve(dispute.id, "Favor Initiator")}>
                           <UserCheck className="mr-2 h-4 w-4 text-green-600" /> Resolver a favor del Iniciador
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleQuickResolve(dispute.id, "Favor Accused")}>
                           <UserX className="mr-2 h-4 w-4 text-red-600" /> Resolver a favor del Acusado
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleEscalate(dispute.id)}>
                           <ShieldQuestion className="mr-2 h-4 w-4 text-yellow-600" /> Escalar Disputa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDisputes.length === 0 && (
             <div className="text-center p-8 text-muted-foreground">
                <Search className="mx-auto h-12 w-12 mb-4" />
                No se encontraron disputas que coincidan con tus criterios.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDispute && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles de Disputa: {selectedDispute.id}</DialogTitle>
              <DialogDescription>Revisar evidencia, comunicación y arbitrar esta disputa.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6 space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Información de la Disputa</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div><Label className="font-semibold">Iniciada Por:</Label> {selectedDispute.initiatedBy.name} ({selectedDispute.initiatedBy.role})</div>
                  <div><Label className="font-semibold">Parte Acusada:</Label> {selectedDispute.accusedParty.name} ({selectedDispute.accusedParty.role})</div>
                  <div><Label className="font-semibold">Fecha de Creación:</Label> {selectedDispute.dateCreated}</div>
                  <div><Label className="font-semibold">Última Actualización:</Label> {selectedDispute.lastUpdate}</div>
                  <div><Label className="font-semibold">Servicio/Publicación:</Label> {selectedDispute.serviceName || "N/A"}</div>
                  <div><Label className="font-semibold">Estado:</Label> <Badge className={getStatusBadgeVariant(selectedDispute.status)}>{selectedDispute.status}</Badge></div>
                </CardContent>
              </Card>
             
              <Card>
                <CardHeader><CardTitle className="text-lg">Detalles del Reclamo</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <Label className="font-semibold">Motivo de la Disputa:</Label>
                        <p className="p-2 border rounded-md bg-muted/50">{selectedDispute.reason}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Descripción por el Iniciador:</Label>
                        <p className="p-2 border rounded-md bg-muted/50 min-h-[60px] whitespace-pre-wrap">{selectedDispute.description}</p>
                    </div>
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle className="text-lg">Evidencia (Placeholder)</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground p-2 border rounded-md border-dashed">
                    {selectedDispute.evidence?.length ? selectedDispute.evidence.map(e => e.fileName).join(', ') : "Aún no se ha subido evidencia. Esta sección mostraría archivos/imágenes subidas."}
                    </p>
                    <Button variant="outline" size="sm" disabled> <Eye className="mr-2 h-3 w-3" /> Ver Evidencia (No Implementado)</Button>
                </CardContent>
               </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Registro de Comunicación (Placeholder)</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground p-2 border rounded-md border-dashed min-h-[80px]">
                        Esta área mostraría mensajes intercambiados entre las partes y el administrador sobre esta disputa.
                    </p>
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle className="text-lg">Acciones y Notas del Administrador</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Label htmlFor="currentAdminNotesModal" className="font-semibold">Notas Internas del Administrador:</Label>
                    <Textarea id="currentAdminNotesModal" value={currentAdminNotes} onChange={(e) => setCurrentAdminNotes(e.target.value)} placeholder="Notas internas para esta disputa. Visible solo para administradores." rows={4} />
                    <Button onClick={() => { console.log("Guardando notas para", selectedDispute.id, ":", currentAdminNotes); setIsDetailsModalOpen(false); handleOpenChangeStatusModal(selectedDispute); }}>
                        Actualizar Estado / Guardar Notas
                    </Button>
                </CardContent>
               </Card>

            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedDispute && (
        <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cambiar Estado de Disputa</DialogTitle>
              <DialogDescription>Actualizar estado para el ticket {selectedDispute.id}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>Estado Actual: <Badge className={getStatusBadgeVariant(selectedDispute.status)}>{selectedDispute.status}</Badge></p>
              <div>
                <Label htmlFor="newDisputeStatus">Nuevo Estado</Label>
                <Select value={newStatusToSet} onValueChange={(value) => setNewStatusToSet(value as DisputeStatus)}>
                  <SelectTrigger id="newDisputeStatus"><SelectValue placeholder="Selecciona nuevo estado" /></SelectTrigger>
                  <SelectContent>
                    {allDisputeStatuses.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adminNotesForStatusChange">Notas del Administrador (se añadirán si existen notas)</Label>
                <Textarea id="adminNotesForStatusChange" value={currentAdminNotes} onChange={(e) => setCurrentAdminNotes(e.target.value)} placeholder="Añadir o actualizar notas del administrador..." />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={handleSaveStatusChange} disabled={!newStatusToSet || newStatusToSet === selectedDispute.status}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
