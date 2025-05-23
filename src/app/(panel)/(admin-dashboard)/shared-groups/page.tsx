import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Mock data
const groups = [
  { id: "g1", name: "Netflix Premium Family", service: "Netflix", sharer: "Bob The Builder", members: 4, maxMembers: 5, status: "Active", created: "2023-06-01", icon: "https://placehold.co/40x40.png?text=N" },
  { id: "g2", name: "Spotify Duo Mix", service: "Spotify", sharer: "Edward Elric", members: 2, maxMembers: 2, status: "Full", created: "2023-07-15", icon: "https://placehold.co/40x40.png?text=S" },
  { id: "g3", name: "HBO Max Shared", service: "HBO Max", sharer: "Alice Wonderland", members: 1, maxMembers: 3, status: "Recruiting", created: "2023-08-01", icon: "https://placehold.co/40x40.png?text=H" },
];

export default function SharedGroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shared Group Overview</h1>
        <p className="text-muted-foreground">Centralized view of all shared subscription groups.</p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Shared Groups</CardTitle>
          <CardDescription>Monitor and manage all active and pending shared groups.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Icon</TableHead>
                <TableHead>Group Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Sharer</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <Image src={group.icon} alt={group.service} width={32} height={32} className="rounded-sm" data-ai-hint="app logo" />
                  </TableCell>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.service}</TableCell>
                  <TableCell>{group.sharer}</TableCell>
                  <TableCell>{group.members}/{group.maxMembers}</TableCell>
                  <TableCell>
                    <Badge variant={group.status === 'Active' ? 'default' : group.status === 'Full' ? 'secondary' : 'outline'}
                           className={group.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 
                                      group.status === 'Recruiting' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' : ''}>
                      {group.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{group.created}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
