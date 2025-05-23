
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Slash, UserCog, PlayCircle, PauseCircle, Trash2, Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, type Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

type UserStatus = "Active" | "Inactive" | "Pending" | "Suspended" | "Frozen";

interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Can be comma-separated for multiple roles like "Sharer, Subscriber"
  status: UserStatus;
  joined: string;
  avatar: string;
  // Raw data from Firestore for actions
  originalStatus?: UserStatus;
}

const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-500/20 text-green-700 border-green-500/30';
        case 'Inactive': return 'bg-gray-400/20 text-gray-600 border-gray-400/30';
        case 'Suspended': return 'bg-red-500/20 text-red-700 border-red-500/30';
        case 'Frozen': return 'bg-blue-400/20 text-blue-600 border-blue-400/30';
        case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
        default: return 'secondary';
    }
};

const getRoleBadgeStyling = (role: string) => {
    if (role.toLowerCase().includes('admin')) return 'bg-primary/20 text-primary border-primary/30';
    if (role.toLowerCase().includes('sharer') && role.toLowerCase().includes('subscriber')) return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
    if (role.toLowerCase().includes('sharer')) return 'bg-accent/20 text-accent-foreground border-accent/30';
    if (role.toLowerCase().includes('subscriber')) return 'bg-teal-500/20 text-teal-700 border-teal-500/30';
    return 'bg-muted text-muted-foreground border-border';
};


export default function UsersPage() {
  const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const userStatus = data.status as UserStatus || "Active"; // Default to Active if status is not set
        usersData.push({
          id: doc.id,
          name: data.fullName || data.displayName || data.alias || "N/A",
          email: data.email || "N/A",
          role: (data.roles || ["subscriber"]).join(', '),
          status: userStatus,
          originalStatus: userStatus, // Store original status for toggle actions
          joined: data.createdAt ? (data.createdAt as Timestamp).toDate().toLocaleDateString() : "N/A",
          avatar: data.photoURL || `https://placehold.co/40x40.png?text=${(data.displayName || "U").substring(0,1)}`,
        });
      });
      setFetchedUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      toast({
        title: "Error al cargar usuarios",
        description: "No se pudieron obtener los datos de los usuarios desde Firestore.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const updateUserStatus = async (userId: string, newStatus: UserStatus) => {
    const userDocRef = doc(db, "users", userId);
    try {
      await updateDoc(userDocRef, { status: newStatus });
      toast({
        title: "Estado de Usuario Actualizado",
        description: `El estado del usuario ${userId} ha sido cambiado a ${newStatus}.`,
      });
    } catch (error) {
      console.error(`Error updating user ${userId} status to ${newStatus}: `, error);
      toast({
        title: "Error al Actualizar Estado",
        description: `No se pudo cambiar el estado del usuario. ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleSuspendUser = (userId: string) => {
    console.log(`Suspending user ${userId}`);
    updateUserStatus(userId, "Suspended");
  };

  const handleUnsuspendUser = (userId: string) => {
    console.log(`Un-suspending user ${userId}`);
    // Find the user's original status or default to Active
    const user = fetchedUsers.find(u => u.id === userId);
    const originalStatus = user?.originalStatus && user.originalStatus !== "Suspended" ? user.originalStatus : "Active";
    updateUserStatus(userId, originalStatus);
  };
  
  const handleFreezeUser = (userId: string) => {
    console.log(`Freezing user account ${userId}`);
     updateUserStatus(userId, "Frozen");
  };

  const handleUnfreezeUser = (userId: string) => {
    console.log(`Un-freezing user account ${userId}`);
    const user = fetchedUsers.find(u => u.id === userId);
    const originalStatus = user?.originalStatus && user.originalStatus !== "Frozen" ? user.originalStatus : "Active";
    updateUserStatus(userId, originalStatus);
  };
  
  const handleDeleteUser = async (userId: string) => {
    // Basic confirmation, ideally use an AlertDialog
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${userId}? Esta acción no se puede deshacer.`)) {
      return;
    }
    console.log(`Deleting user ${userId}`);
    const userDocRef = doc(db, "users", userId);
    try {
      await deleteDoc(userDocRef);
      toast({
        title: "Usuario Eliminado",
        description: `El usuario ${userId} ha sido eliminado.`,
      });
      // The onSnapshot listener will automatically update the UI
    } catch (error) {
       console.error(`Error deleting user ${userId}: `, error);
      toast({
        title: "Error al Eliminar Usuario",
        description: `No se pudo eliminar el usuario. ${error.message}`,
        variant: "destructive",
      });
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View, edit, and manage platform users.</p>
        </div>
        <Button disabled> {/* TODO: Implement Add New User Dialog */}
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the platform, including their roles and status.</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchedUsers.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
                <Search className="mx-auto h-12 w-12 mb-4" />
                No users found in the platform.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role(s)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                        data-ai-hint="profile avatar" 
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={'outline'}
                        className={getRoleBadgeStyling(user.role)}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                          variant={'outline'}
                          className={getStatusBadgeVariant(user.status)}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joined}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem disabled> {/* TODO: Link to user edit page or open edit dialog */}
                              <UserCog className="mr-2 h-4 w-4" />
                              Edit User Details 
                          </DropdownMenuItem>
                          {user.status !== "Suspended" ? (
                              <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                                  <Slash className="mr-2 h-4 w-4 text-orange-600" />
                                  Suspend User
                              </DropdownMenuItem>
                          ) : (
                              <DropdownMenuItem onClick={() => handleUnsuspendUser(user.id)}>
                                  <PlayCircle className="mr-2 h-4 w-4 text-green-600" />
                                  Un-suspend User
                              </DropdownMenuItem>
                          )}

                          {user.status !== "Frozen" ? (
                              <DropdownMenuItem onClick={() => handleFreezeUser(user.id)}>
                                  <PauseCircle className="mr-2 h-4 w-4 text-blue-600" />
                                  Freeze Account
                              </DropdownMenuItem>
                          ) : (
                              <DropdownMenuItem onClick={() => handleUnfreezeUser(user.id)}>
                                  <PlayCircle className="mr-2 h-4 w-4 text-green-600" />
                                  Un-freeze Account
                              </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive hover:!bg-destructive/10 hover:!text-destructive" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
