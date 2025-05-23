
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, CheckCircle, Search, Filter as FilterIcon, PlayCircle, Gavel, UserCheck, UserX, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


type DisputePartyRole = "Participant" | "Owner";
type DisputeStatus = "New" | "Pending User Response" | "Pending Admin Review" | "Resolved - Favor User" | "Resolved - Favor Sharer" | "Resolved - Dismissed" | "Escalated";

interface DisputeTicket {
  id: string;
  dateCreated: string;
  initiatedBy: { id: string, name: string, role: DisputePartyRole };
  accusedParty: { id: string, name: string, role: DisputePartyRole };
  listingId?: string;
  serviceName?: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  lastUpdate: string;
  evidence?: { fileName: string, url: string }[]; // Placeholder
  communicationLog?: { userId: string, message: string, timestamp: string }[]; // Placeholder
  adminNotes?: string;
}

const mockDisputes: DisputeTicket[] = [
  { id: "D001", dateCreated: "2023-07-01", initiatedBy: {id: "u_alice", name: "Alice", role: "Participant"}, accusedParty: {id: "u_bob", name: "Bob (Owner)", role: "Owner"}, serviceName: "Netflix Premium", reason: "Access Revoked Injustamente", description: "My access was removed mid-cycle without any warning. I have paid for this month.", status: "New", lastUpdate: "2023-07-01", adminNotes: "Initial review pending." },
  { id: "D002", dateCreated: "2023-07-02", initiatedBy: {id: "u_charlie", name: "Charlie (Owner)", role: "Owner"}, accusedParty: {id: "u_diana", name: "Diana", role: "Participant"}, serviceName: "Spotify Family", reason: "Abuso de la Suscripción", description: "User sharing credentials with multiple external people. This violates the group agreement.", status: "Pending Admin Review", lastUpdate: "2023-07-03", adminNotes: "Waiting for Diana's response (deadline 2023-07-05). Charlie provided screenshots of suspicious activity." },
  { id: "D003", dateCreated: "2023-06-28", initiatedBy: {id: "u_edward", name: "Edward", role: "Participant"}, accusedParty: {id: "u_frank", name: "Frank (Owner)", role: "Owner"}, serviceName: "HBO Max", reason: "Credenciales Inválidas", description: "Password was changed without notice. I cannot access the service.", status: "Resolved - Favor User", lastUpdate: "2023-07-02", adminNotes: "Frank warned. Access restored for Edward. Frank claims it was an accident." },
  { id: "D004", dateCreated: "2023-07-03", initiatedBy: {id: "u_greg", name: "Greg (Owner)", role: "Owner"}, accusedParty: {id: "u_hannah", name: "Hannah", role: "Participant"}, serviceName: "Disney+", reason: "Pago No Recibido", description: "Payment for this cycle has not been received. User claims it was sent.", status: "Pending User Response", lastUpdate: "2023-07-04", adminNotes: "Hannah asked to provide proof of payment." },
  { id: "D005", dateCreated: "2023-07-05", initiatedBy: {id: "u_ivan", name: "Ivan", role: "Participant"}, accusedParty: {id: "u_julia", name: "Julia (Owner)", role: "Owner"}, serviceName: "YouTube Premium", reason: "Servicio No Corresponde a lo Ofertado", description: "Advertised as ad-free, but I am still seeing ads.", status: "Escalated", lastUpdate: "2023-07-06", adminNotes: "Needs urgent review. Potential misrepresentation by owner." },
];


const getStatusBadgeVariant = (status: DisputeStatus) => {
  switch (status) {
    case "New": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Pending User Response": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    case "Pending Admin Review": return "bg-orange-500/20 text-orange-700 border-orange-500/30";
    case "Resolved - Favor User":
    case "Resolved - Favor Sharer":
      return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Resolved - Dismissed": return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    case "Escalated": return "bg-red-500/20 text-red-700 border-red-500/30";
    default: return "secondary";
  }
};

const allDisputeStatuses: DisputeStatus[] = ["New", "Pending User Response", "Pending Admin Review", "Resolved - Favor User", "Resolved - Favor Sharer", "Resolved - Dismissed", "Escalated"];


export default function AdminDisputesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [disputes, setDisputes] = useState<DisputeTicket[]>(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<DisputeTicket | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatusToSet, setNewStatusToSet] = useState<DisputeStatus | "">("");
  const [currentAdminNotes, setCurrentAdminNotes] = useState("");


  const filteredDisputes = disputes.filter(d =>
    (d.initiatedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.accusedParty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (d.serviceName && d.serviceName.toLowerCase().includes(searchTerm.toLowerCase()))
    ) &&
    (filterStatus === "all" || d.status === filterStatus)
  );

  const handleViewDetails = (dispute: DisputeTicket) => {
    setSelectedDispute(dispute);
    setCurrentAdminNotes(dispute.adminNotes || "");
    setIsDetailsModalOpen(true);
  };

  const handleOpenChangeStatusModal = (dispute: DisputeTicket) => {
    setSelectedDispute(dispute);
    setNewStatusToSet(dispute.status); // Pre-fill with current status
    setCurrentAdminNotes(dispute.adminNotes || "");
    setIsStatusModalOpen(true);
  };

  const handleSaveStatusChange = () => {
    if (selectedDispute && newStatusToSet) {
      // In a real app, update backend here
      console.log(`Updating status for ${selectedDispute.id} to ${newStatusToSet} with notes: ${currentAdminNotes}`);
      setDisputes(prevDisputes => prevDisputes.map(d => 
        d.id === selectedDispute.id 
        ? { ...d, status: newStatusToSet as DisputeStatus, adminNotes: currentAdminNotes, lastUpdate: new Date().toISOString().split('T')[0] } 
        : d
      ));
      setIsStatusModalOpen(false);
      setSelectedDispute(null);
    }
  };
  
  const handleQuickResolve = (disputeId: string, resolution: "Favor Initiator" | "Favor Accused") => {
    console.log(`Quick resolving dispute ${disputeId}: ${resolution}`);
    const newStatus = resolution === "Favor Initiator" ? "Resolved - Favor User" : "Resolved - Favor Sharer";
     setDisputes(prevDisputes => prevDisputes.map(d => 
        d.id === disputeId 
        ? { ...d, status: newStatus, adminNotes: `${d.adminNotes || ''}\nQuick resolved: ${resolution}.`, lastUpdate: new Date().toISOString().split('T')[0] } 
        : d
      ));
      // Potentially add a toast message
  };

  const handleEscalate = (disputeId: string) => {
    console.log(`Escalating dispute ${disputeId}`);
    setDisputes(prevDisputes => prevDisputes.map(d => 
        d.id === disputeId 
        ? { ...d, status: "Escalated", adminNotes: `${d.adminNotes || ''}\nEscalated for further review.`, lastUpdate: new Date().toISOString().split('T')[0] } 
        : d
      ));
    // Potentially add a toast message
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Disputes</h1>
        <p className="text-muted-foreground">Review, arbitrate, and resolve user-reported disputes.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filter & Search Disputes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, User, Service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {allDisputeStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Dispute Tickets</CardTitle>
          <CardDescription>A list of all reported disputes requiring attention.</CardDescription>
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
                  <TableCell className="max-w-[200px] truncate" title={dispute.reason}>{dispute.reason}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenChangeStatusModal(dispute)}>
                          <Edit className="mr-2 h-4 w-4" /> Change Status & Notes
                        </DropdownMenuItem>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleQuickResolve(dispute.id, "Favor Initiator")}>
                           <UserCheck className="mr-2 h-4 w-4 text-green-600" /> Resolve for Initiator
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleQuickResolve(dispute.id, "Favor Accused")}>
                           <UserX className="mr-2 h-4 w-4 text-red-600" /> Resolve for Accused
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleEscalate(dispute.id)}>
                           <ShieldQuestion className="mr-2 h-4 w-4 text-yellow-600" /> Escalate Further
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
              <DialogDescription>Review evidence, communication, and arbitrate this dispute.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6 space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Dispute Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div><Label className="font-semibold">Initiated By:</Label> {selectedDispute.initiatedBy.name} ({selectedDispute.initiatedBy.role})</div>
                  <div><Label className="font-semibold">Accused Party:</Label> {selectedDispute.accusedParty.name} ({selectedDispute.accusedParty.role})</div>
                  <div><Label className="font-semibold">Date Created:</Label> {selectedDispute.dateCreated}</div>
                  <div><Label className="font-semibold">Last Update:</Label> {selectedDispute.lastUpdate}</div>
                  <div><Label className="font-semibold">Service/Listing:</Label> {selectedDispute.serviceName || "N/A"}</div>
                  <div><Label className="font-semibold">Status:</Label> <Badge className={getStatusBadgeVariant(selectedDispute.status)}>{selectedDispute.status}</Badge></div>
                </CardContent>
              </Card>
             
              <Card>
                <CardHeader><CardTitle className="text-lg">Claim Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <Label className="font-semibold">Reason for Dispute:</Label>
                        <p className="p-2 border rounded-md bg-muted/50">{selectedDispute.reason}</p>
                    </div>
                    <div>
                        <Label className="font-semibold">Description by Initiator:</Label>
                        <p className="p-2 border rounded-md bg-muted/50 min-h-[60px] whitespace-pre-wrap">{selectedDispute.description}</p>
                    </div>
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle className="text-lg">Evidence (Placeholder)</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground p-2 border rounded-md border-dashed">
                    {selectedDispute.evidence?.length ? selectedDispute.evidence.map(e => e.fileName).join(', ') : "No evidence uploaded by users yet. This section would display uploaded files/images."}
                    </p>
                    {/* Placeholder for admin to upload evidence or for user evidence to appear */}
                    <Button variant="outline" size="sm" disabled> <Eye className="mr-2 h-3 w-3" /> View Evidence (Not Implemented)</Button>
                </CardContent>
               </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Communication Log (Placeholder)</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground p-2 border rounded-md border-dashed min-h-[80px]">
                        This area would show messages exchanged between parties and admin regarding this dispute. Each message would have a timestamp and sender.
                    </p>
                    {/* Example of a message item - loop through these in a real app */}
                    {/* <div className="p-2 border-b"><strong>Admin:</strong> Requested more info from Participant. (2023-07-05 10:00)</div> */}
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle className="text-lg">Admin Actions & Notes</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Label htmlFor="currentAdminNotesModal" className="font-semibold">Internal Admin Notes:</Label>
                    <Textarea id="currentAdminNotesModal" value={currentAdminNotes} onChange={(e) => setCurrentAdminNotes(e.target.value)} placeholder="Internal notes for this dispute. Visible only to admins." rows={4} />
                    <Button onClick={() => { /* Logic to save notes */ console.log("Saving notes for", selectedDispute.id, ":", currentAdminNotes); setIsDetailsModalOpen(false); handleOpenChangeStatusModal(selectedDispute); }}>
                        Update Status / Save Notes
                    </Button>
                </CardContent>
               </Card>

            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
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
                <Select value={newStatusToSet} onValueChange={(value) => setNewStatusToSet(value as DisputeStatus)}>
                  <SelectTrigger id="newDisputeStatus"><SelectValue placeholder="Select new status" /></SelectTrigger>
                  <SelectContent>
                    {allDisputeStatuses.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adminNotesForStatusChange">Admin Notes (will append if notes exist)</Label>
                <Textarea id="adminNotesForStatusChange" value={currentAdminNotes} onChange={(e) => setCurrentAdminNotes(e.target.value)} placeholder="Add or update admin notes..." />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSaveStatusChange} disabled={!newStatusToSet || newStatusToSet === selectedDispute.status}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
