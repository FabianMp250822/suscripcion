import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Mock data
const paymentHistory = [
  { id: "pay1", date: "2023-06-15", serviceName: "Netflix Premium", amount: 5.99, status: "Paid", icon: "https://placehold.co/40x40.png?text=N" },
  { id: "pay2", date: "2023-06-20", serviceName: "Spotify Duo", amount: 3.00, status: "Paid", icon: "https://placehold.co/40x40.png?text=S" },
  { id: "pay3", date: "2023-05-15", serviceName: "Netflix Premium", amount: 5.99, status: "Paid", icon: "https://placehold.co/40x40.png?text=N" },
  { id: "pay4", date: "2023-05-20", serviceName: "Spotify Duo", amount: 3.00, status: "Failed", icon: "https://placehold.co/40x40.png?text=S" },
];

export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">Review your past payments and invoices.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download All Invoices
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>A list of your recent transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Icon</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Image src={payment.icon} alt={payment.serviceName} width={32} height={32} className="rounded-sm" data-ai-hint="app logo" />
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="font-medium">{payment.serviceName}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "Paid" ? "default" : "destructive"}
                           className={payment.status === "Paid" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Receipt className="mr-1 h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {paymentHistory.length === 0 && (
            <div className="p-8 text-center">
                <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No Payment History</h3>
                <p className="text-muted-foreground">Your payment records will appear here once you make transactions.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
