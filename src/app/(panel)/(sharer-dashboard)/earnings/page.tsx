
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Download, Banknote, Loader2, Info } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlyEarning {
  month: string;
  earnings: number;
}

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  method: string;
}

const chartConfig = {
  earnings: { label: "Earnings ($)", color: "hsl(var(--chart-2))" },
};

export default function EarningsPage() {
  const [totalEarned, setTotalEarned] = useState<number | null>(null);
  const [availableForPayout, setAvailableForPayout] = useState<number | null>(null);
  const [activeSharesCount, setActiveSharesCount] = useState<number | null>(null);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState<MonthlyEarning[]>([]);
  const [recentPayoutsData, setRecentPayoutsData] = useState<Payout[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingPayouts, setLoadingPayouts] = useState(true);

  useEffect(() => {
    // TODO: Fetch summary data (totalEarned, availableForPayout, activeSharesCount) from Firestore
    const timer = setTimeout(() => {
      setTotalEarned(0); // Example: set to 0 if no data
      setAvailableForPayout(0);
      setActiveSharesCount(0);
      setLoadingSummary(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // TODO: Fetch monthly earnings data for the chart from Firestore
    const timer = setTimeout(() => {
      setMonthlyEarningsData([]); // Example: set to empty if no data
      setLoadingChart(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // TODO: Fetch recent payouts data for the table from Firestore
    const timer = setTimeout(() => {
      setRecentPayoutsData([]); // Example: set to empty if no data
      setLoadingPayouts(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">Track your earnings from shared subscriptions.</p>
        </div>
        <Button variant="outline" disabled> {/* TODO: Implement Payout Request */}
          <Banknote className="mr-2 h-4 w-4" /> Request Payout
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Understanding Your Earnings</AlertTitle>
        <AlertDescription>
          The earnings displayed on this page reflect the amount you receive after SuscripGrupo's service fee has been applied to the subscriber's total payment. You set your desired price when creating a listing, and our platform fee is added on top for the subscriber.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned (USD)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div className="text-3xl font-bold">${(totalEarned ?? 0).toFixed(2)}</div>
            )}
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card className="shadow-lg md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available for Payout (USD)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loadingSummary ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-3xl font-bold">${(availableForPayout ?? 0).toFixed(2)}</div>
            )}
             {/* <p className="text-xs text-muted-foreground">Next payout: July 1st</p> */}
          </CardContent>
        </Card>
         <Card className="shadow-lg md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shared Groups</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-1/4" />
            ) : (
              <div className="text-3xl font-bold">{activeSharesCount ?? 0}</div>
            )}
            {/* <p className="text-xs text-muted-foreground">Currently active shared groups</p> */}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
          <CardDescription>Your earnings trend over the past few months.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingChart ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Loading chart data...</p>
            </div>
          ) : monthlyEarningsData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <Line dataKey="earnings" type="monotone" stroke="var(--color-earnings)" strokeWidth={2} dot={{ r:4, fill: "var(--color-earnings)"}} activeDot={{r:6}} name="Earnings" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No earnings data available for the selected period.</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Payouts</CardTitle>
            <CardDescription>History of your payouts.</CardDescription>
          </div>
          <Button variant="outline" size="sm" disabled> {/* TODO: Implement Download Statement */}
            <Download className="mr-2 h-4 w-4" /> Download Statement
          </Button>
        </CardHeader>
        <CardContent>
          {loadingPayouts ? (
             <div className="flex items-center justify-center h-[150px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Loading payouts...</p>
            </div>
          ) : recentPayoutsData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount (USD)</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayoutsData.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{payout.date}</TableCell>
                    <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          payout.status === 'Completed' ? 'bg-green-500/20 text-green-700 border-green-500/30' :
                          payout.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' :
                          'bg-red-500/20 text-red-700 border-red-500/30'
                        }
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No payout history found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    