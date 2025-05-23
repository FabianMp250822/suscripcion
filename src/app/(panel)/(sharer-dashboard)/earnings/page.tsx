"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Download, Banknote } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const earningsData = [
  { month: "Jan", earnings: 30.50 }, { month: "Feb", earnings: 45.20 }, { month: "Mar", earnings: 60.00 },
  { month: "Apr", earnings: 55.75 }, { month: "May", earnings: 75.00 }, { month: "Jun", earnings: 90.25 },
];

const chartConfig = {
  earnings: { label: "Earnings ($)", color: "hsl(var(--chart-2))" }, // Using chart-2 color from globals.css
};

const recentPayouts = [
  { id: "p1", date: "2023-06-15", amount: 70.00, status: "Completed", method: "PayPal" },
  { id: "p2", date: "2023-05-15", amount: 50.50, status: "Completed", method: "Bank Transfer" },
  { id: "p3", date: "2023-04-15", amount: 65.20, status: "Completed", method: "PayPal" },
];

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">Track your earnings from shared subscriptions.</p>
        </div>
        <Button variant="outline">
          <Banknote className="mr-2 h-4 w-4" /> Request Payout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1,234.56</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available for Payout</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$250.75</div>
             <p className="text-xs text-muted-foreground">Next payout: July 1st</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shares</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Currently active shared groups</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
          <CardDescription>Your earnings trend over the past few months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <RechartsLineChart data={earningsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="var(--color-earnings)" strokeWidth={2} dot={{ r:4, fill: "var(--color-earnings)"}} activeDot={{r:6}} />
            </RechartsLineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Payouts</CardTitle>
            <CardDescription>History of your payouts.</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Download Statement
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell>
                    <Badge variant={payout.status === "Completed" ? "default" : "secondary"}
                           className={payout.status === 'Completed' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>
                      {payout.status}
                    </Badge>
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
