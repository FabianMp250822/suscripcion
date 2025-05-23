
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Slash, UserCog, PlayCircle, PauseCircle, Trash2 } from "lucide-react"; // Added UserCog, PlayCircle, PauseCircle
import Image from "next/image";
import Link from "next/link"; // For future "View Details" page

type UserStatus = "Active" | "Inactive" | "Pending" | "Suspended" | "Frozen";

interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Can be comma-separated for multiple roles like "Sharer, Subscriber"
  status: UserStatus;
  joined: string;
  avatar: string;
}

// Mock data - replace with actual data fetching
const users: User[] = [
  { id: "1", name: "Alice Wonderland", email: "subscriber.alice@example.com", role: "Subscriber", status: "Active", joined: "2023-01-15", avatar: "https://placehold.co/40x40.png?text=AW" },
  { id: "2", name: "Bob The Builder", email: "sharer.bob@example.com", role: "Sharer", status: "Active", joined: "2023-02-20", avatar: "https://placehold.co/40x40.png?text=BB" },
  { id: "3", name: "Charlie Chaplin (Admin)", email: "admin.charlie@example.com", role: "Admin", status: "Active", joined: "2023-03-10", avatar: "https://placehold.co/40x40.png?text=CC" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Subscriber", status: "Inactive", joined: "2023-04-05", avatar: "https://placehold.co/40x40.png?text=DP" },
  { id: "5", name: "Edward Elric", email: "sharer.edward@example.com", role: "Sharer", status: "Pending", joined: "2023-05-12", avatar: "https://placehold.co/40x40.png?text=EE" },
  { id: "6", name: "Sam Stone (Sharer & Sub)", email: "sharer.subscriber.sam@example.com", role: "Sharer, Subscriber", status: "Active", joined: "2023-06-01", avatar: "https://placehold.co/40x40.png?text=SS" },
  { id: "7", name: "Sue Smith", email: "subscriber.sue@example.com", role: "Subscriber", status: "Active", joined: "2023-06-05", avatar: "https://placehold.co/40x40.png?text=SUE" },
  { id: "8", name: "Suspended User Acc", email: "suspended.user@example.com", role: "Subscriber", status: "Suspended", joined: "2023-01-01", avatar: "https://placehold.co/40x40.png?text=SU" },
  { id: "9", name: "Arthur Pendragon (Admin)", email: "admin.arthur@example.com", role: "Admin", status: "Active", joined: "2023-07-01", avatar: "https://placehold.co/40x40.png?text=AP" },
  { id: "10", name: "Fiona Frozen", email: "frozen.fiona@example.com", role: "Subscriber", status: "Frozen", joined: "2023-02-10", avatar: "https://placehold.co/40x40.png?text=FF" },
];

const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-500/20 text-green-700 border-green-500/30';
        case 'Inactive': return 'bg-gray-400/20 text-gray-600 border-gray-400/30';
        case 'Suspended': return 'bg-red-500/20 text-red-700 border-red-500/30';
        case 'Frozen': return 'bg-blue-400/20 text-blue-600 border-blue-400/30'; // Specific style for Frozen
        case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
        default: return 'secondary';
    }
};

const getRoleBadgeStyling = (role: string) => {
    if (role.includes('Admin')) return 'bg-primary/20 text-primary border-primary/30';
    if (role.includes('Sharer') && role.includes('Subscriber')) return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
    if (role.includes('Sharer')) return 'bg-accent/20 text-accent-foreground border-accent/30';
    if (role.includes('Subscriber')) return 'bg-teal-500/20 text-teal-700 border-teal-500/30'; // Using teal for subscriber
    return 'bg-muted text-muted-foreground border-border';
};


export default function UsersPage() {
  // TODO: Add state management for users if edits are to be reflected live
  // For now, actions will just console.log

  const handleSuspendUser = (userId: string) => {
    console.log(`Suspending user ${userId}`);
    // Update mock data: users.find(u => u.id === userId)!.status = "Suspended";
    // Then re-render or update state
  };

  const handleFreezeUser = (userId: string) => {
    console.log(`Freezing user account ${userId}`);
    // Update mock data: users.find(u => u.id === userId)!.status = "Frozen";
    // Then re-render or update state
  };
  
  const handleDeleteUser = (userId: string) => {
    console.log(`Deleting user ${userId}`);
    // Remove from mock data and re-render
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View, edit, and manage platform users.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the platform, including their roles and status.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {users.map((user) => (
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
                      variant={'outline'} // Base variant
                      className={getRoleBadgeStyling(user.role)}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                        variant={'outline'} // Base variant
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
                        <DropdownMenuItem>
                            <UserCog className="mr-2 h-4 w-4" />
                            Edit User Details
                        </DropdownMenuItem>
                         {user.status !== "Suspended" && (
                            <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                                <Slash className="mr-2 h-4 w-4 text-orange-600" />
                                Suspend User
                            </DropdownMenuItem>
                         )}
                         {user.status === "Suspended" && (
                             <DropdownMenuItem onClick={() => console.log(`Un-suspending ${user.id}`)}>
                                <PlayCircle className="mr-2 h-4 w-4 text-green-600" />
                                Un-suspend User
                            </DropdownMenuItem>
                         )}

                         {user.status !== "Frozen" && (
                            <DropdownMenuItem onClick={() => handleFreezeUser(user.id)}>
                                <PauseCircle className="mr-2 h-4 w-4 text-blue-600" />
                                Freeze Account (Privacy)
                            </DropdownMenuItem>
                         )}
                         {user.status === "Frozen" && (
                             <DropdownMenuItem onClick={() => console.log(`Un-freezing ${user.id}`)}>
                                <PlayCircle className="mr-2 h-4 w-4 text-green-600" />
                                Un-freeze Account
                            </DropdownMenuItem>
                         )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
}
