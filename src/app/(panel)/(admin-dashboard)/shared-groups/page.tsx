
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, Timestamp, type DocumentData, doc, updateDoc, getDoc } from "firebase/firestore";
import { Loader2, ListX, MoreHorizontal, Eye, AlertCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type ListingStatus = "Activo" | "Reclutando" | "Suspendido" | "Lleno" | "Desconocido";

interface Group {
  id: string;
  name: string;
  service: string;
  sharerName: string;
  sharerId: string;
  sharerEmail: string; // Added sharer's email
  members: number;
  maxMembers: number;
  status: ListingStatus;
  created: string;
  icon: string;
  pricePerSpot?: number; // Assuming listings have this
  listingDescription?: string; // Assuming listings have this
}

export default function AdminSharedGroupsPage() {
  const [fetchedGroups, setFetchedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const listingsRef = collection(db, "listings");
    const q = query(listingsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const groupsDataPromises: Promise<Group | null>[] = querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data() as DocumentData;
        const createdAtTimestamp = data.createdAt as Timestamp;

        let sharerEmail = "No disponible";
        if (data.sharerId) {
          try {
            const userDocRef = doc(db, "users", data.sharerId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              sharerEmail = userDocSnap.data()?.email || "No disponible";
            }
          } catch (emailError) {
            console.error("Error fetching sharer email: ", emailError);
          }
        }

        return {
          id: docSnapshot.id,
          name: data.serviceName || "N/A",
          service: data.serviceName || "N/A",
          sharerName: data.sharerName || "Desconocido",
          sharerId: data.sharerId || "N/A",
          sharerEmail: sharerEmail,
          members: (data.totalSpots || 0) - (data.spotsAvailable || 0),
          maxMembers: data.totalSpots || 0,
          status: data.status as ListingStatus || "Desconocido",
          created: createdAtTimestamp ? createdAtTimestamp.toDate().toLocaleDateString() : "N/A",
          icon: data.iconUrl || `https://placehold.co/40x40.png?text=${(data.serviceName || "S").substring(0,1)}`,
          pricePerSpot: data.pricePerSpot,
          listingDescription: data.listingDescription,
        };
      });

      const resolvedGroupsData = (await Promise.all(groupsDataPromises)).filter(group => group !== null) as Group[];
      setFetchedGroups(resolvedGroupsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shared groups: ", error);
      toast({
        title: "Error al Cargar Grupos",
        description: "No se pudieron obtener los datos de los grupos compartidos.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const getStatusBadgeVariant = (status: ListingStatus): string => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'reclutando':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'suspendido':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'lleno':
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      default:
        return 'bg-slate-500/20 text-slate-700 border-slate-500/30';
    }
  };

  const handleViewDetails = (group: Group) => {
    setSelectedGroup(group);
    setIsDetailsModalOpen(true);
  };

  const handleToggleListingStatus = async (listingId: string, currentStatus: ListingStatus) => {
    const newStatus = (currentStatus === "Activo" || currentStatus === "Reclutando") ? "Suspendido" : "Activo";
    const listingRef = doc(db, "listings", listingId);
    try {
      await updateDoc(listingRef, { status: newStatus });
      toast({
        title: "Estado de Publicación Actualizado",
        description: `La publicación ${listingId} ha sido ${newStatus === "Suspendido" ? "suspendida" : "reactivada"}.`,
      });
    } catch (error) {
      console.error("Error updating listing status: ", error);
      toast({
        title: "Error al Actualizar",
        description: "No se pudo actualizar el estado de la publicación.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vista General de Grupos Compartidos</h1>
        <p className="text-muted-foreground">Supervisión centralizada de todos los grupos de suscripción compartidos.</p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Todos los Grupos Compartidos</CardTitle>
          <CardDescription>Monitorea y gestiona todos los grupos compartidos activos, pendientes y suspendidos.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Cargando grupos...</p>
            </div>
          ) : fetchedGroups.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Ícono</TableHead>
                  <TableHead>Nombre del Servicio</TableHead>
                  <TableHead>Propietario (Email)</TableHead>
                  <TableHead>Miembros</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchedGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <Image src={group.icon} alt={group.service} width={32} height={32} className="rounded-sm" data-ai-hint="app logo" />
                    </TableCell>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.sharerName} <span className="text-xs text-muted-foreground">({group.sharerEmail})</span></TableCell>
                    <TableCell>{group.members}/{group.maxMembers}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(group.status)}>
                        {group.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{group.created}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewDetails(group)}>
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                          </DropdownMenuItem>
                          {(group.status === "Activo" || group.status === "Reclutando") && (
                            <DropdownMenuItem onClick={() => handleToggleListingStatus(group.id, group.status)}>
                              <AlertCircle className="mr-2 h-4 w-4 text-orange-600" /> Suspender Publicación
                            </DropdownMenuItem>
                          )}
                          {group.status === "Suspendido" && (
                            <DropdownMenuItem onClick={() => handleToggleListingStatus(group.id, group.status)}>
                              <PlayCircle className="mr-2 h-4 w-4 text-green-600" /> Reactivar Publicación
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <ListX className="mx-auto h-12 w-12 mb-4" />
              <p className="font-semibold">No se encontraron grupos compartidos.</p>
              <p className="text-sm">Actualmente no hay grupos listados en la plataforma.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedGroup && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles del Grupo Compartido</DialogTitle>
              <DialogDescription>Información completa de la publicación ID: {selectedGroup.id}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex items-center gap-4">
                <Image src={selectedGroup.icon} alt={selectedGroup.name} width={64} height={64} className="rounded-md border bg-muted p-1" data-ai-hint="app logo" />
                <div>
                  <h3 className="text-xl font-semibold">{selectedGroup.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedGroup.service}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div><Label className="font-semibold">Propietario (Sharer):</Label> {selectedGroup.sharerName} ({selectedGroup.sharerEmail})</div>
                <div><Label className="font-semibold">ID del Propietario:</Label> {selectedGroup.sharerId}</div>
                <div><Label className="font-semibold">Miembros:</Label> {selectedGroup.members} de {selectedGroup.maxMembers}</div>
                <div><Label className="font-semibold">Estado de Publicación:</Label> <Badge className={getStatusBadgeVariant(selectedGroup.status)}>{selectedGroup.status}</Badge></div>
                <div><Label className="font-semibold">Precio por Cupo (Establecido por Sharer):</Label> ${selectedGroup.pricePerSpot?.toFixed(2) || 'N/A'}</div>
                <div><Label className="font-semibold">Fecha de Creación:</Label> {selectedGroup.created}</div>
                {selectedGroup.listingDescription && (
                  <div>
                    <Label className="font-semibold">Descripción de la Publicación:</Label>
                    <p className="mt-1 p-2 border rounded-md bg-muted/50 whitespace-pre-wrap">{selectedGroup.listingDescription}</p>
                  </div>
                )}
              </div>
              
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
