
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Slash } from "lucide-react";
import Image from "next/image";

// Mock data - replace with actual data fetching
const users = [
  { id: "1", name: "Alice Wonderland", email: "subscriber.alice@example.com", role: "Subscriber", status: "Active", joined: "2023-01-15", avatar: "https://placehold.co/40x40.png?text=AW" },
  { id: "2", name: "Bob The Builder", email: "sharer.bob@example.com", role: "Sharer", status: "Active", joined: "2023-02-20", avatar: "https://placehold.co/40x40.png?text=BB" },
  { id: "3", name: "Charlie Chaplin", email: "admin.charlie@example.com", role: "Admin", status: "Active", joined: "2023-03-10", avatar: "https://placehold.co/40x40.png?text=CC" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Subscriber", status: "Inactive", joined: "2023-04-05", avatar: "https://placehold.co/40x40.png?text=DP" },
  { id: "5", name: "Edward Elric", email: "sharer.edward@example.com", role: "Sharer", status: "Pending", joined: "2023-05-12", avatar: "https://placehold.co/40x40.png?text=EE" },
  { id: "6", name: "Sam Stone", email: "sharer.subscriber.sam@example.com", role: "Sharer, Subscriber", status: "Active", joined: "2023-06-01", avatar: "https://placehold.co/40x40.png?text=SS" },
  { id: "7", name: "Sue Smith", email: "subscriber.sue@example.com", role: "Subscriber", status: "Active", joined: "2023-06-05", avatar: "https://placehold.co/40x40.png?text=SUE" },
  { id: "8", name: "Suspended User", email: "suspended.user@example.com", role: "Subscriber", status: "Suspended", joined: "2023-01-01", avatar: "https://placehold.co/40x40.png?text=SU" },
];

export default function UsersPage() {
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
          <CardDescription>A list of all users in the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
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
                      data-ai-hint="profile avatar" />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.role.includes('Admin') ? 'default' : user.role.includes('Sharer') ? 'secondary' : 'outline'}
                      className={
                        user.role.includes('Admin') ? 'bg-primary/20 text-primary border-primary/30' : 
                        user.role.includes('Sharer') && user.role.includes('Subscriber') ? 'bg-purple-500/20 text-purple-700 border-purple-500/30' : 
                        user.role.includes('Sharer') ? 'bg-accent/20 text-accent-foreground border-accent/30' : 
                        'bg-muted text-muted-foreground border-border' 
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                        variant={
                            user.status === 'Active' ? 'default' : 
                            user.status === 'Inactive' ? 'destructive' :
                            user.status === 'Suspended' ? 'outline' : 
                            'secondary'
                        } 
                        className={
                            user.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' :
                            user.status === 'Inactive' ? 'bg-red-500/20 text-red-700 border-red-500/30' :
                            user.status === 'Suspended' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' :
                            'bg-gray-500/20 text-gray-700 border-gray-500/30' // For Pending or other statuses
                        }
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Slash className="mr-2 h-4 w-4" />
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
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
