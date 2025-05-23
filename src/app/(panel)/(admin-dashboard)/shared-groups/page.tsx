
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, Timestamp, type DocumentData } from "firebase/firestore";
import { Loader2, ListX } from "lucide-react"; // Added ListX for empty state

interface Group {
  id: string;
  name: string;
  service: string;
  sharer: string;
  members: number;
  maxMembers: number;
  status: string;
  created: string;
  icon: string;
}

export default function AdminSharedGroupsPage() {
  const [fetchedGroups, setFetchedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const listingsRef = collection(db, "listings");
    const q = query(listingsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groupsData: Group[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        const createdAtTimestamp = data.createdAt as Timestamp;
        groupsData.push({
          id: doc.id,
          name: data.serviceName || "N/A",
          service: data.serviceName || "N/A",
          sharer: data.sharerName || "Desconocido",
          members: (data.totalSpots || 0) - (data.spotsAvailable || 0),
          maxMembers: data.totalSpots || 0,
          status: data.status || "Desconocido",
          created: createdAtTimestamp ? createdAtTimestamp.toDate().toLocaleDateString() : "N/A",
          icon: data.iconUrl || `https://placehold.co/40x40.png?text=${(data.serviceName || "S").substring(0,1)}`,
        });
      });
      setFetchedGroups(groupsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shared groups: ", error);
      // Consider adding a toast message for the user here
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'full':
      case 'lleno':
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'recruiting':
      case 'reclutando':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default:
        return 'secondary';
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
          <CardDescription>Monitorea y gestiona todos los grupos compartidos activos y pendientes.</CardDescription>
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
                  <TableHead>Nombre del Grupo</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Miembros</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchedGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <Image src={group.icon} alt={group.service} width={32} height={32} className="rounded-sm" data-ai-hint="app logo" />
                    </TableCell>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.service}</TableCell>
                    <TableCell>{group.sharer}</TableCell>
                    <TableCell>{group.members}/{group.maxMembers}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(group.status)}>
                        {group.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{group.created}</TableCell>
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
