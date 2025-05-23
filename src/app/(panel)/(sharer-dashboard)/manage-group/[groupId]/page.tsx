import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, MessageSquare, DollarSign, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";

// Mock data
const groupDetails = {
  id: "g1",
  name: "Netflix Premium Shared",
  serviceIcon: "https://placehold.co/64x64.png?text=N",
  sharer: "Your Name Here",
  totalSpots: 5,
  filledSpots: 3,
  pricePerSpot: 7.99,
};

const members = [
  { id: "m1", name: "John Doe", email: "john@example.com", joinedDate: "2023-08-01", paymentStatus: "Paid", avatar: "https://placehold.co/40x40.png?text=JD" },
  { id: "m2", name: "Jane Smith", email: "jane@example.com", joinedDate: "2023-08-05", paymentStatus: "Pending", avatar: "https://placehold.co/40x40.png?text=JS" },
  { id: "m3", name: "Mike Johnson", email: "mike@example.com", joinedDate: "2023-08-10", paymentStatus: "Paid", avatar: "https://placehold.co/40x40.png?text=MJ" },
  { id: "m4", name: "Pending User", email: "N/A", joinedDate: "N/A", paymentStatus: "N/A", avatar: "https://placehold.co/40x40.png?text=?" },
  { id: "m5", name: "Pending User", email: "N/A", joinedDate: "N/A", paymentStatus: "N/A", avatar: "https://placehold.co/40x40.png?text=?" },
];

export default function ManageGroupPage({ params }: { params: { groupId: string } }) {
  // In a real app, fetch groupDetails and members using params.groupId
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <Image src={groupDetails.serviceIcon} alt={groupDetails.name} width={64} height={64} className="rounded-lg" data-ai-hint="app logo" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Group: {groupDetails.name}</h1>
            <p className="text-muted-foreground">Group ID: {params.groupId}</p>
            <p className="text-sm text-muted-foreground">Shared by: {groupDetails.sharer}</p>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium">Members</p>
              <p className="text-lg font-semibold">{groupDetails.filledSpots} / {groupDetails.totalSpots}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <DollarSign className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-sm font-medium">Price per Spot</p>
              <p className="text-lg font-semibold">${groupDetails.pricePerSpot.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <CheckCircle className="h-6 w-6 text-accent" />
            <div>
              <p className="text-sm font-medium">Group Status</p>
              <p className="text-lg font-semibold">{groupDetails.filledSpots === groupDetails.totalSpots ? "Full" : "Recruiting"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Group Members</CardTitle>
          <CardDescription>View and manage members of this group.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.slice(0, groupDetails.filledSpots).map((member) => ( // Show actual members
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="profile avatar" />
                      <AvatarFallback>{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.joinedDate}</TableCell>
                  <TableCell>
                    <Badge variant={member.paymentStatus === "Paid" ? "default" : "destructive"}
                           className={member.paymentStatus === "Paid" ? "bg-green-500/20 text-green-700 border-green-500/30" : "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"}>
                      {member.paymentStatus === "Paid" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                      {member.paymentStatus}
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
                          <MessageSquare className="mr-2 h-4 w-4" /> Message Member
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <DollarSign className="mr-2 h-4 w-4" /> Record Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" /> Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {Array.from({ length: groupDetails.totalSpots - groupDetails.filledSpots }).map((_, index) => ( // Show empty spots
                <TableRow key={`empty-${index}`}>
                  <TableCell>
                    <Avatar>
                       <AvatarImage src="https://placehold.co/40x40.png?text=?" data-ai-hint="placeholder avatar" />
                       <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell colSpan={4} className="text-muted-foreground italic">Empty Spot</TableCell>
                  <TableCell className="text-right">
                     <Button variant="outline" size="sm">Invite User</Button>
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
