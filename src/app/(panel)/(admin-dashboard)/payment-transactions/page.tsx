
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format, addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { MoreHorizontal, Search, Filter, Calendar as CalendarIcon, Eye, Edit, CheckCircle, UploadCloud, FileText, Ban } from "lucide-react";
import Image from "next/image";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "In Dispute" | "Verified" | "Refunded";

interface Transaction {
  id: string;
  date: string;
  payerName: string;
  payerEmail: string;
  payerAvatar: string;
  payeeName: string;
  payeeEmail: string;
  payeeAvatar: string;
  serviceName: string;
  serviceIcon: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  proofUrl?: string; // Optional URL for payment proof
}

const mockTransactions: Transaction[] = [
  { id: "txn_1", date: "2023-06-15", payerName: "Alice Wonderland", payerEmail: "alice@example.com", payerAvatar: "https://placehold.co/40x40.png?text=AW", payeeName: "Bob The Builder", payeeEmail: "bob.sharer@example.com", payeeAvatar: "https://placehold.co/40x40.png?text=BB", serviceName: "Netflix Premium", serviceIcon: "https://placehold.co/40x40.png?text=N", amount: 5.99, status: "Paid", paymentMethod: "Credit Card" },
  { id: "txn_2", date: "2023-06-20", payerName: "Charlie Chaplin", payerEmail: "charlie@example.com", payerAvatar: "https://placehold.co/40x40.png?text=CC", payeeName: "Edward Elric", payeeEmail: "ed.sharer@example.com", payeeAvatar: "https://placehold.co/40x40.png?text=EE", serviceName: "Spotify Duo", serviceIcon: "https://placehold.co/40x40.png?text=S", amount: 3.00, status: "Pending", paymentMethod: "PayPal" },
  { id: "txn_3", date: "2023-05-15", payerName: "Diana Prince", payerEmail: "diana@example.com", payerAvatar: "https://placehold.co/40x40.png?text=DP", payeeName: "Bob The Builder", payeeEmail: "bob.sharer@example.com", payeeAvatar: "https://placehold.co/40x40.png?text=BB", serviceName: "Netflix Premium", serviceIcon: "https://placehold.co/40x40.png?text=N", amount: 5.99, status: "Verified", paymentMethod: "Bank Transfer", proofUrl: "#"},
  { id: "txn_4", date: "2023-05-20", payerName: "Edward Elric", payerEmail: "ed.sharer@example.com", payerAvatar: "https://placehold.co/40x40.png?text=EE", payeeName: "Alice Wonderland", payeeEmail: "alice@example.com", payeeAvatar: "https://placehold.co/40x40.png?text=AW", serviceName: "HBO Max", serviceIcon: "https://placehold.co/40x40.png?text=H", amount: 7.50, status: "Failed", paymentMethod: "Credit Card" },
  { id: "txn_5", date: "2023-06-01", payerName: "Sam Stone", payerEmail: "sam@example.com", payerAvatar: "https://placehold.co/40x40.png?text=SS", payeeName: "Diana Prince", payeeEmail: "diana@example.com", payeeAvatar: "https://placehold.co/40x40.png?text=DP", serviceName: "Disney+", serviceIcon: "https://placehold.co/40x40.png?text=D", amount: 4.20, status: "In Dispute", paymentMethod: "PayPal"},
  { id: "txn_6", date: "2023-04-10", payerName: "Sue Smith", payerEmail: "sue@example.com", payerAvatar: "https://placehold.co/40x40.png?text=SUE", payeeName: "Charlie Chaplin", payeeEmail: "charlie@example.com", payeeAvatar: "https://placehold.co/40x40.png?text=CC", serviceName: "YouTube Premium", serviceIcon: "https://placehold.co/40x40.png?text=YT", amount: 2.50, status: "Refunded", paymentMethod: "Credit Card"},
];

const getStatusBadgeVariant = (status: PaymentStatus) => {
  switch (status) {
    case "Paid": return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Pending": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    case "Failed": return "bg-red-500/20 text-red-700 border-red-500/30";
    case "In Dispute": return "bg-orange-500/20 text-orange-700 border-orange-500/30";
    case "Verified": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Refunded": return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    default: return "secondary";
  }
};

export default function PaymentTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterService, setFilterService] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<PaymentStatus | "">("");

  // TODO: Implement actual filtering logic based on searchTerm, filterStatus, filterService, dateRange
  const filteredTransactions = mockTransactions.filter(tx => 
    (tx.payerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     tx.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tx.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filterStatus === "all" || tx.status === filterStatus) &&
    (filterService === "all" || tx.serviceName === filterService) &&
    (!dateRange?.from || new Date(tx.date) >= dateRange.from) &&
    (!dateRange?.to || new Date(tx.date) <= dateRange.to)
  );

  const services = Array.from(new Set(mockTransactions.map(tx => tx.serviceName)));
  const statuses = Array.from(new Set(mockTransactions.map(tx => tx.status)));

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const handleChangeStatus = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewStatus(transaction.status); // Pre-fill with current status
    setIsStatusModalOpen(true);
  };
  
  const handleMarkAsVerified = (transactionId: string) => {
    // In a real app, this would update the backend
    console.log("Marking transaction as verified:", transactionId);
    const index = mockTransactions.findIndex(tx => tx.id === transactionId);
    if (index !== -1) {
      mockTransactions[index].status = "Verified";
      // Force re-render if not using a state management library that handles this
      setSearchTerm(prev => prev + " "); setTimeout(()=>setSearchTerm(prev=>prev.trim()),0);
    }
  };

  const handleSaveStatusChange = () => {
    if (selectedTransaction && newStatus) {
      // In a real app, update backend here
      console.log(`Updating status for ${selectedTransaction.id} to ${newStatus}`);
      const index = mockTransactions.findIndex(tx => tx.id === selectedTransaction.id);
      if (index !== -1) {
        mockTransactions[index].status = newStatus as PaymentStatus;
      }
      setIsStatusModalOpen(false);
      setSelectedTransaction(null);
      // Force re-render
      setSearchTerm(prev => prev + " "); setTimeout(()=>setSearchTerm(prev=>prev.trim()),0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Transactions</h1>
        <p className="text-muted-foreground">View and manage all platform payment transactions.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input 
              placeholder="Search by User, Service, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lg:col-span-2"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger><SelectValue placeholder="Filter by Service" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!dateRange && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A list of all recorded payment transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Txn ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image src={tx.payerAvatar} alt={tx.payerName} width={24} height={24} className="rounded-full" data-ai-hint="profile avatar" />
                      {tx.payerName}
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                      <Image src={tx.payeeAvatar} alt={tx.payeeName} width={24} height={24} className="rounded-full" data-ai-hint="profile avatar" />
                      {tx.payeeName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Image src={tx.serviceIcon} alt={tx.serviceName} width={24} height={24} className="rounded-sm" data-ai-hint="app logo" />
                        {tx.serviceName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(tx.status)}>{tx.status}</Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(tx)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(tx)}>
                          <Edit className="mr-2 h-4 w-4" /> Change Status
                        </DropdownMenuItem>
                         {tx.status !== "Verified" && tx.status !== "Paid" && (
                            <DropdownMenuItem onClick={() => handleMarkAsVerified(tx.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Verified
                            </DropdownMenuItem>
                         )}
                         {tx.status === "In Dispute" && (
                             <DropdownMenuItem>
                                <Ban className="mr-2 h-4 w-4" /> Resolve Dispute
                            </DropdownMenuItem>
                         )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTransactions.length === 0 && (
             <div className="text-center p-8 text-muted-foreground">
                <Search className="mx-auto h-12 w-12 mb-4" />
                No transactions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Transaction Details: {selectedTransaction.id}</DialogTitle>
              <DialogDescription>Detailed view of the payment transaction.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label className="text-right">Payer:</Label>
                <div className="flex items-center gap-2">
                    <Image src={selectedTransaction.payerAvatar} alt={selectedTransaction.payerName} width={32} height={32} className="rounded-full" data-ai-hint="profile avatar"/>
                    <span>{selectedTransaction.payerName} ({selectedTransaction.payerEmail})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label className="text-right">Payee:</Label>
                 <div className="flex items-center gap-2">
                    <Image src={selectedTransaction.payeeAvatar} alt={selectedTransaction.payeeName} width={32} height={32} className="rounded-full" data-ai-hint="profile avatar"/>
                    <span>{selectedTransaction.payeeName} ({selectedTransaction.payeeEmail})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label className="text-right">Service:</Label>
                <div className="flex items-center gap-2">
                    <Image src={selectedTransaction.serviceIcon} alt={selectedTransaction.serviceName} width={32} height={32} className="rounded-sm" data-ai-hint="app logo"/>
                    <span>{selectedTransaction.serviceName}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label className="text-right">Amount:</Label>
                <span className="font-semibold">${selectedTransaction.amount.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label className="text-right">Date:</Label>
                <span>{selectedTransaction.date}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label className="text-right">Status:</Label>
                <Badge className={getStatusBadgeVariant(selectedTransaction.status)}>{selectedTransaction.status}</Badge>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label className="text-right">Payment Method:</Label>
                <span>{selectedTransaction.paymentMethod}</span>
              </div>
               {selectedTransaction.proofUrl && (
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Payment Proof:</Label>
                    <Button variant="outline" size="sm" asChild>
                        <a href={selectedTransaction.proofUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" /> View Proof
                        </a>
                    </Button>
                </div>
              )}
               {!selectedTransaction.proofUrl && (
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Payment Proof:</Label>
                     <span className="text-muted-foreground text-sm">Not uploaded</span>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Change Payment Status Modal */}
      {selectedTransaction && (
        <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Payment Status</DialogTitle>
              <DialogDescription>Update the status for transaction {selectedTransaction.id}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>Current Status: <Badge className={getStatusBadgeVariant(selectedTransaction.status)}>{selectedTransaction.status}</Badge></p>
              <div>
                <Label htmlFor="newStatus">New Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as PaymentStatus)}>
                  <SelectTrigger id="newStatus"><SelectValue placeholder="Select new status" /></SelectTrigger>
                  <SelectContent>
                    {(["Paid", "Pending", "Failed", "In Dispute", "Verified", "Refunded"] as PaymentStatus[]).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSaveStatusChange} disabled={!newStatus || newStatus === selectedTransaction.status}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

