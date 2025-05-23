"use client"

import { BarChart, LineChart, PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, Cell } from "recharts";

const userSignupsData = [
  { month: "Jan", users: 120 }, { month: "Feb", users: 200 }, { month: "Mar", users: 150 },
  { month: "Apr", users: 280 }, { month: "May", users: 220 }, { month: "Jun", users: 350 },
];

const revenueData = [
  { month: "Jan", revenue: 1200 }, { month: "Feb", revenue: 1900 }, { month: "Mar", revenue: 1600 },
  { month: "Apr", revenue: 2500 }, { month: "May", revenue: 2200 }, { month: "Jun", revenue: 3300 },
];

const subscriptionDistributionData = [
  { name: "Basic Tier", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Standard Tier", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Premium Tier", value: 300, fill: "hsl(var(--chart-3))" },
  { name: "Family Tier", value: 200, fill: "hsl(var(--chart-4))" },
];

const chartConfig = {
  users: { label: "Users", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue ($)", color: "hsl(var(--chart-2))" },
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reporting & Statistics</h1>
        <p className="text-muted-foreground">Generate reports and visualize platform usage data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User Signups Over Time</CardTitle>
            <CardDescription>Monthly new user registrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart data={userSignupsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <RechartsLegend />
                <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue (MRR)</CardTitle>
            <CardDescription>Track your platform's revenue growth.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsLineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <RechartsLegend />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r:4, fill: "var(--color-revenue)"}} activeDot={{r:6}} />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Subscription Tier Distribution</CardTitle>
          <CardDescription>Breakdown of users by subscription tier.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
           <ChartContainer config={{}} className="h-[350px] w-full max-w-lg">
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Pie
                  data={subscriptionDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {subscriptionDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                 <ChartLegend content={<ChartLegendContent />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
