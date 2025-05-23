
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, Timestamp, type DocumentData, doc, updateDoc } from "firebase/firestore";
import { Loader2, ListX, MoreHorizontal, Eye, AlertCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type ListingStatus = "Activo" | "Reclutando" | "Suspendido" | "Lleno" | "Desconocido";

interface Group {
  id: string;
  name: string;
  service: string;
  sharerName: string; // Name of the SuscripGrupo user who listed it
  sharerId: string; // UID of the SuscripGrupo user
  members: number;
  maxMembers: number;
  status: ListingStatus;
  created: string;
  icon: string;
}

export default function AdminSharedGroupsPage() {
  const [fetchedGroups, setFetchedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const listingsRef = collection(db, "listings");
    const q = query(listingsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groupsData: Group[] = [];
      querySnapshot.forEach((docSnapshot) => { // Renamed doc to docSnapshot to avoid conflict
        const data = docSnapshot.data() as DocumentData;
        const createdAtTimestamp = data.createdAt as Timestamp;
        groupsData.push({
          id: docSnapshot.id,
          name: data.serviceName || "N/A",
          service: data.serviceName || "N/A",
          sharerName: data.sharerName || "Desconocido",
          sharerId: data.sharerId || "N/A",
          members: (data.totalSpots || 0) - (data.spotsAvailable || 0),
          maxMembers: data.totalSpots || 0,
          status: data.status as ListingStatus || "Desconocido",
          created: createdAtTimestamp ? createdAtTimestamp.toDate().toLocaleDateString() : "N/A",
          icon: data.iconUrl || `https://placehold.co/40x40.png?text=${(data.serviceName || "S").substring(0,1)}`,
        });
      });
      setFetchedGroups(groupsData);
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
        return 'bg-slate-500/20 text-slate-700 border-slate-500/30'; // For "Desconocido" or other
    }
  };

  const handleViewDetails = (groupId: string) => {
    console.log("Viewing details for group:", groupId);
    // TODO: Implement modal or navigation to a detail page
    toast({
      title: "Acción Pendiente",
      description: `La visualización de detalles para el grupo ${groupId} aún no está implementada.`,
    });
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
                  <TableHead>Propietario (Sharer)</TableHead>
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
                    <TableCell>{group.sharerName} ({group.sharerId.substring(0,6)}...)</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewDetails(group.id)}>
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
    </div>
  );
}

