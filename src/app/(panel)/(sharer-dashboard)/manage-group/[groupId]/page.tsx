"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CheckCircle, XCircle, MessageSquare, DollarSign, MoreHorizontal, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, collection, query, where, getDocs, type DocumentData, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface GroupListing {
  id: string;
  serviceName: string;
  iconUrl: string;
  sharerName: string;
  sharerId: string;
  listingDescription?: string;
  totalSpots: number;
  spotsAvailable: number;
  pricePerSpot: number;
  status: string;
  createdAt?: Timestamp;
}

interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  userId: string;
}

export default function ManageGroupPage({ params }: { params: { groupId: string } }) {
  const [groupDetails, setGroupDetails] = useState<GroupListing | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // No desestructurar groupId aquí para evitar el warnForSyncAccess

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      setError(null);
      setGroupDetails(null);
      setMembers([]);

      // Validar params y params.groupId aquí dentro
      if (!params || typeof params.groupId !== 'string' || params.groupId.trim() === '') {
        setError("ID de grupo no válido o no proporcionado.");
        setLoading(false);
        return;
      }
      const groupIdFromParams = params.groupId; // Usar una variable local para claridad

      if (user === undefined) {
        // El estado del usuario aún no se ha determinado, esperar.
        return;
      }

      if (user === null) {
        router.push('/login');
        setLoading(false);
        return;
      }

      if (!user.uid) {
         setError("Información de usuario no disponible. Por favor, reintenta.");
         setLoading(false);
         return;
      }

      try {
        const groupDoc = await getDoc(doc(db, "listings", groupIdFromParams));
        
        if (!groupDoc.exists()) {
          setError("Grupo no encontrado");
          return; 
        }

        const groupData = groupDoc.data() as DocumentData;
        
        if (groupData.sharerId !== user.uid) {
          setError("No tienes permisos para administrar este grupo");
          return; 
        }

        const group: GroupListing = {
          id: groupDoc.id,
          serviceName: groupData.serviceName || "N/A",
          iconUrl: groupData.iconUrl || `https://placehold.co/64x64.png?text=${(groupData.serviceName || "S").substring(0,1)}`,
          sharerName: groupData.sharerName || "Usuario",
          sharerId: groupData.sharerId,
          listingDescription: groupData.listingDescription || "",
          totalSpots: groupData.totalSpots || 0,
          spotsAvailable: groupData.spotsAvailable || 0,
          pricePerSpot: groupData.pricePerSpot || 0,
          status: groupData.status || "Unknown",
          createdAt: groupData.createdAt,
        };

        setGroupDetails(group);

        const fetchMembersForGroup = async (currentGroupId: string, sharerId: string) => {
          const membersQuery = query(
            collection(db, "groupMembers"),
            where("groupId", "==", currentGroupId)
          );

          try {
            const membersSnapshot = await getDocs(membersQuery);
            if (membersSnapshot.empty) {
              console.log("No se encontraron miembros para este grupo");
              return [];
            }
            
            return membersSnapshot.docs.map(doc => {
              const data = doc.data();
              let joinedDate = "N/A";
              try {
                if (data.joinedAt && typeof data.joinedAt === 'object' && 'seconds' in data.joinedAt) {
                  joinedDate = new Date(data.joinedAt.seconds * 1000).toLocaleDateString();
                }
              } catch (err) {
                console.error("Error al formatear fecha", err);
              }
              return {
                id: doc.id,
                name: data.memberName || "Usuario",
                email: data.memberEmail || "No email",
                avatar: data.memberAvatar || `https://placehold.co/40x40.png?text=${(data.memberName || "U").substring(0,1)}`,
                joinedDate: joinedDate,
                paymentStatus: data.paymentStatus || 'Pending',
                userId: data.memberId || "unknown",
              };
            });
          } catch (error) {
            console.error("Error fetching members:", error);
            return []; 
          }
        };

        const fetchedMembers = await fetchMembersForGroup(groupIdFromParams, groupData.sharerId);
        setMembers(fetchedMembers);

      } catch (error: any) {
        console.error("Error fetching group data:", error);
        if (error.code === 'permission-denied') {
          setError("No tienes permisos para acceder a los datos de este grupo. Verifica tus credenciales.");
        } else if (error.message && error.message.includes("permissions")) {
          setError("Error de permisos: Contacta al administrador para verificar tus permisos de acceso.");
        } else {
          setError("Error al cargar los datos del grupo: " + (error.message || "Error desconocido"));
        }
      } finally {
        setLoading(false); 
      }
    };

    // La validación de params.groupId se hace ahora dentro de fetchGroupData.
    // El efecto se ejecutará si params, user o router cambian.
    // La lógica interna de fetchGroupData manejará si debe proceder o no.
    fetchGroupData();

  }, [params, user, router]); // Dependencias: params, user, router

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold">Error</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Volver
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!groupDetails) {
    return (
        <div className="flex justify-center items-center py-20">
             <p className="text-muted-foreground">No se pudieron cargar los detalles del grupo o el grupo no existe.</p>
        </div>
    );
  }

  const filledSpots = members.length;
  const emptySpots = groupDetails.totalSpots - filledSpots;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-start gap-4">
          <Image 
            src={groupDetails.iconUrl} 
            alt={groupDetails.serviceName} 
            width={64} 
            height={64} 
            className="rounded-lg object-contain" 
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Administrar Grupo: {groupDetails.serviceName}</h1>
            {/* Usar params.groupId aquí, ya que groupDetails está disponible */}
            <p className="text-muted-foreground">ID del Grupo: {params.groupId}</p> 
            <p className="text-sm text-muted-foreground">Compartido por: {groupDetails.sharerName}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 rounded-md border p-4">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Miembros</p>
                <p className="text-lg font-semibold">{filledSpots} / {groupDetails.totalSpots}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-md border p-4">
              <DollarSign className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium">Precio por Lugar</p>
                <p className="text-lg font-semibold">${groupDetails.pricePerSpot.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-md border p-4">
              <CheckCircle className="h-6 w-6 text-accent" />
              <div>
                <p className="text-sm font-medium">Estado del Grupo</p>
                <p className="text-lg font-semibold">{groupDetails.status}</p>
              </div>
            </div>
          </div>
          {groupDetails.listingDescription && (
            <div className="pt-4">
              <h3 className="text-md font-semibold mb-1">Detalles/Expectativas del Grupo:</h3>
              <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/30 whitespace-pre-wrap">
                {groupDetails.listingDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Miembros del Grupo</CardTitle>
          <CardDescription>Ver y administrar los miembros de este grupo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fecha de Ingreso</TableHead>
                <TableHead>Estado de Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 || emptySpots > 0 ? ( 
                <>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.joinedDate}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={member.paymentStatus === "Paid" ? "default" : "destructive"}
                          className={
                            member.paymentStatus === "Paid" 
                              ? "bg-green-500/20 text-green-700 border-green-500/30" 
                              : member.paymentStatus === "Pending"
                              ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
                              : "bg-red-500/20 text-red-700 border-red-500/30"
                          }
                        >
                          {member.paymentStatus === "Paid" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {member.paymentStatus === "Paid" ? "Pagado" : 
                           member.paymentStatus === "Pending" ? "Pendiente" : "Vencido"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" /> Enviar Mensaje
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DollarSign className="mr-2 h-4 w-4" /> Registrar Pago
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" /> Remover Miembro
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptySpots > 0 && (
                    Array.from({ length: emptySpots }).map((_, index) => (
                      <TableRow key={`empty-${index}`}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src="https://placehold.co/40x40.png?text=?" />
                            <AvatarFallback>?</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell colSpan={4} className="text-muted-foreground italic">Lugar Vacío</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Invitar Usuario</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">No hay miembros en este grupo</p>
                      <p className="text-muted-foreground">Invita a usuarios para empezar a compartir</p>
                      <Button variant="outline" className="mt-4">
                        Invitar Usuarios
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
