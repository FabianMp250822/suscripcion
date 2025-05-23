
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, CheckCircle, Search, Filter as FilterIcon, PlayCircle, Gavel, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


type DisputeStatus = "New" | "Pending User Response" | "Pending Admin Review" | "Resolved - Favor User" | "Resolved - Favor Sharer" | "Resolved - Dismissed" | "Escalated";

interface DisputeTicket {
  id: string;
  dateCreated: string;
  initiatedBy: { id: string, name: string, role: "Participant" | "Owner" };
  accusedParty: { id: string, name: string, role: "Participant" | "Owner" };
  listingId?: string;
  serviceName?: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  lastUpdate: string;
  evidence?: { fileName: string, url: string }[];
  adminNotes?: string;
}

const mockDisputes: DisputeTicket[] = [
  { id: "D001", dateCreated: "2023-07-01", initiatedBy: {id: "u_alice", name: "Alice (Participant)", role: "Participant"}, accusedParty: {id: "u_bob", name: "Bob (Owner)", role: "Owner"}, serviceName: "Netflix Premium", reason: "Access Revoked Injustamente", description: "My access was removed mid-cycle.", status: "New", lastUpdate: "2023-07-01" },
  { id: "D002", dateCreated: "2023-07-02", initiatedBy: {id: "u_charlie", name: "Charlie (Owner)", role: "Owner"}, accusedParty: {id: "u_diana", name: "Diana (Participant)", role: "Participant"}, serviceName: "Spotify Family", reason: "Abuso de la Suscripción", description: "User sharing credentials.", status: "Pending Admin Review", lastUpdate: "2023-07-03", adminNotes: "Waiting for Diana's response." },
  { id: "D003", dateCreated: "2023-06-28", initiatedBy: {id: "u_edward", name: "Edward (Participant)", role: "Participant"}, accusedParty: {id: "u_frank", name: "Frank (Owner)", role: "Owner"}, serviceName: "HBO Max", reason: "Credenciales Inválidas", description: "Password changed without notice.", status: "Resolved - Favor User", lastUpdate: "2023-07-02", adminNotes: "Frank warned. Access restored." },
];


const getStatusBadgeVariant = (status: DisputeStatus) => {
  switch (status) {
    case "New": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Pending User Response":
    case "Pending Admin Review":
      return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    case "Resolved - Favor User":
    case "Resolved - Favor Sharer":
    case "Resolved - Dismissed":
      return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Escalated": return "bg-red-500/20 text-red-700 border-red-500/30";
    default: return "secondary";
  }
};

export default function AdminDisputesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDispute, setSelectedDispute] = useState<DisputeTicket | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<DisputeStatus | "">("");
  const [adminNotes, setAdminNotes] = useState("");

  // Placeholder for filtering logic
  const filteredDisputes = mockDisputes.filter(d =>
    (d.initiatedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.accusedParty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (d.serviceName && d.serviceName.toLowerCase().includes(searchTerm.toLowerCase()))
    ) &&
    (filterStatus === "all" || d.status === filterStatus)
  );

  const allStatuses = Array.from(new Set(mockDisputes.map(d => d.status))) as DisputeStatus[];


  const handleViewDetails = (dispute: DisputeTicket) => {
    setSelectedDispute(dispute);
    setAdminNotes(dispute.adminNotes || "");
    setIsDetailsModalOpen(true);
  };

  const handleChangeStatus = (dispute: DisputeTicket) => {
    setSelectedDispute(dispute);
    setNewStatus(dispute.status);
    setAdminNotes(dispute.adminNotes || "");
    setIsStatusModalOpen(true);
  };

  const handleSaveStatusChange = () => {
    if (selectedDispute && newStatus) {
      // In a real app, update backend here
      console.log(`Updating status for ${selectedDispute.id} to ${newStatus} with notes: ${adminNotes}`);
      const index = mockDisputes.findIndex(d => d.id === selectedDispute.id);
      if (index !== -1) {
        mockDisputes[index].status = newStatus as DisputeStatus;
        mockDisputes[index].adminNotes = adminNotes;
        mockDisputes[index].lastUpdate = new Date().toISOString().split('T')[0];
      }
      setIsStatusModalOpen(false);
      setSelectedDispute(null);
      // Force re-render
      setSearchTerm(prev => prev + " "); setTimeout(() => setSearchTerm(prev => prev.trim()), 0);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Disputes</h1>
        <p className="text-muted-foreground">Review and arbitrate user-reported disputes.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filter & Search Disputes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by ID, User, Service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {allStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Dispute Tickets</CardTitle>
          <CardDescription>A list of all reported disputes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Initiator</TableHead>
                <TableHead>Accused</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="max-w-[200px] truncate">{dispute.reason}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(dispute.status)}>{dispute.status}</Badge>
                  </TableCell>
                  <TableCell>{dispute.lastUpdate}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(dispute)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details & Arbitrate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(dispute)}>
                          <Edit className="mr-2 h-4 w-4" /> Change Status & Notes
                        </DropdownMenuItem>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem>
                           <UserCheck className="mr-2 h-4 w-4 text-green-600" /> Resolve for Initiator
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                           <UserX className="mr-2 h-4 w-4 text-red-600" /> Resolve for Accused
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                           <Gavel className="mr-2 h-4 w-4 text-yellow-600" /> Escalate Further
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
                No disputes found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* View/Arbitrate Dispute Details Modal */}
      {selectedDispute && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Dispute Details: {selectedDispute.id}</DialogTitle>
              <DialogDescription>Review and arbitrate this dispute.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div><Label>Initiated By:</Label> <p>{selectedDispute.initiatedBy.name} ({selectedDispute.initiatedBy.role})</p></div>
                <div><Label>Accused Party:</Label> <p>{selectedDispute.accusedParty.name} ({selectedDispute.accusedParty.role})</p></div>
                <div><Label>Date Created:</Label> <p>{selectedDispute.dateCreated}</p></div>
                <div><Label>Last Update:</Label> <p>{selectedDispute.lastUpdate}</p></div>
                <div><Label>Service/Listing:</Label> <p>{selectedDispute.serviceName || "N/A"}</p></div>
                <div><Label>Status:</Label> <Badge className={getStatusBadgeVariant(selectedDispute.status)}>{selectedDispute.status}</Badge></div>
              </div>
              <div className="space-y-1">
                <Label>Reason for Dispute:</Label>
                <p className="text-sm p-2 border rounded-md bg-muted/50">{selectedDispute.reason}</p>
              </div>
              <div className="space-y-1">
                <Label>Description by Initiator:</Label>
                <p className="text-sm p-2 border rounded-md bg-muted/50 min-h-[60px] whitespace-pre-wrap">{selectedDispute.description}</p>
              </div>
               <div className="space-y-1">
                <Label>Evidence (Placeholder):</Label>
                {/* Placeholder for evidence display */}
                <p className="text-sm text-muted-foreground p-2 border rounded-md border-dashed">
                  {selectedDispute.evidence?.length ? selectedDispute.evidence.map(e => e.fileName).join(', ') : "No evidence uploaded yet. This section would display uploaded files/images."}
                </p>
                <Button variant="outline" size="sm" disabled> <Eye className="mr-2 h-3 w-3" /> View Evidence (Not Implemented)</Button>
              </div>
              <div className="space-y-1">
                <Label>Communication Log (Placeholder):</Label>
                 <p className="text-sm text-muted-foreground p-2 border rounded-md border-dashed min-h-[80px]">
                    This area would show messages exchanged between parties and admin regarding this dispute.
                 </p>
              </div>
               <div className="space-y-1">
                <Label htmlFor="currentAdminNotes">Admin Notes:</Label>
                <Textarea id="currentAdminNotes" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Internal notes for this dispute..." rows={3} />
              </div>

            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => { /* Logic to save notes or change status */ setIsDetailsModalOpen(false); handleChangeStatus(selectedDispute); }}>
                Update Status / Add Notes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Change Dispute Status Modal */}
      {selectedDispute && (
        <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Dispute Status</DialogTitle>
              <DialogDescription>Update status for ticket {selectedDispute.id}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>Current Status: <Badge className={getStatusBadgeVariant(selectedDispute.status)}>{selectedDispute.status}</Badge></p>
              <div>
                <Label htmlFor="newDisputeStatus">New Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as DisputeStatus)}>
                  <SelectTrigger id="newDisputeStatus"><SelectValue placeholder="Select new status" /></SelectTrigger>
                  <SelectContent>
                    {allStatuses.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adminNotesModal">Admin Notes</Label>
                <Textarea id="adminNotesModal" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add or update admin notes..." />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSaveStatusChange} disabled={!newStatus || newStatus === selectedDispute.status}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
