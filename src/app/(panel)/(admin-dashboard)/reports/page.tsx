
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, Cell } from "recharts";
import { Loader2, BarChartBig, TrendingUp, PieChartIcon, ListTree } from "lucide-react"; // Added icons

interface ChartDataPoint {
  month?: string;
  date?: string;
  users?: number;
  revenue?: number;
  name?: string; // For Pie chart
  value?: number; // For Pie chart
  fill?: string; // For Pie chart
  platform?: string; // For Most Shared Platforms
  count?: number; // For Most Shared Platforms
}

const initialChartConfig = {
  users: { label: "Usuarios", color: "hsl(var(--chart-1))" },
  revenue: { label: "Ingresos (€)", color: "hsl(var(--chart-2))" },
  // Colors for pie chart slices will be in the data itself
  shares: { label: "Publicaciones Activas", color: "hsl(var(--chart-3))" },
};

export default function ReportsPage() {
  const [userSignupsData, setUserSignupsData] = useState<ChartDataPoint[]>([]);
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [subscriptionDistributionData, setSubscriptionDistributionData] = useState<ChartDataPoint[]>([]);
  const [mostSharedPlatformsData, setMostSharedPlatformsData] = useState<ChartDataPoint[]>([]);

  const [loadingSignups, setLoadingSignups] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingDistribution, setLoadingDistribution] = useState(true);
  const [loadingMostShared, setLoadingMostShared] = useState(true);

  const [chartConfig, setChartConfig] = useState(initialChartConfig);


  useEffect(() => {
    // TODO: Implementar carga de datos de registros de usuarios desde Firestore
    // Ejemplo: Agrupar usuarios por mes de creación
    const timer = setTimeout(() => {
      setUserSignupsData([]); // Iniciar vacío
      setLoadingSignups(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // TODO: Implementar carga de datos de ingresos (MRR) desde Firestore
    // Ejemplo: Agrupar transacciones de plataforma por mes
    const timer = setTimeout(() => {
      setRevenueData([]); // Iniciar vacío
      setLoadingRevenue(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // TODO: Implementar carga de datos de distribución de suscripciones desde Firestore
    // Ejemplo: Contar cuántos usuarios activos hay por tipo de servicio compartido
    const timer = setTimeout(() => {
      setSubscriptionDistributionData([]); // Iniciar vacío
      setLoadingDistribution(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // TODO: Implementar carga de datos de plataformas más compartidas desde Firestore
    // Ejemplo: Contar cuántas publicaciones activas hay por 'serviceName' en la colección 'listings'
    const timer = setTimeout(() => {
      setMostSharedPlatformsData([]); // Iniciar vacío
      setLoadingMostShared(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Informes y Estadísticas</h1>
        <p className="text-muted-foreground">Genera informes y visualiza datos de uso de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><BarChartBig className="mr-2 h-5 w-5 text-primary"/> Registros de Usuarios a lo Largo del Tiempo</CardTitle>
            <CardDescription>Nuevos registros de usuarios mensuales.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loadingSignups ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : userSignupsData.length > 0 ? (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <RechartsBarChart data={userSignupsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <RechartsLegend formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value} />
                  <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} name="users" />
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-muted-foreground">No hay datos de registros para mostrar.</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> Ingresos Mensuales Recurrentes (MRR)</CardTitle>
            <CardDescription>Sigue el crecimiento de los ingresos de tu plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loadingRevenue ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : revenueData.length > 0 ? (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <RechartsLineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <RechartsLegend formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r:4, fill: "var(--color-revenue)"}} activeDot={{r:6}} name="revenue" />
                </RechartsLineChart>
              </ChartContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-muted-foreground">No hay datos de ingresos para mostrar.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-primary"/> Distribución de Suscripciones por Servicio</CardTitle>
            <CardDescription>Desglose de usuarios activos por servicio compartido.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex justify-center items-center">
            {loadingDistribution ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : subscriptionDistributionData.length > 0 ? (
              <ChartContainer config={{}} className="w-full max-w-lg h-full">
                <ResponsiveContainer width="100%" height="100%">
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
                        <Cell key={`cell-${index}`} fill={entry.fill || `hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
               <div className="flex justify-center items-center h-full text-muted-foreground">No hay datos de distribución para mostrar.</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><ListTree className="mr-2 h-5 w-5 text-primary"/> Plataformas Más Compartidas</CardTitle>
            <CardDescription>Servicios con más publicaciones activas en la plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
             {loadingMostShared ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : mostSharedPlatformsData.length > 0 ? (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <RechartsBarChart data={mostSharedPlatformsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={12} />
                  <YAxis dataKey="platform" type="category" stroke="hsl(var(--foreground))" fontSize={12} width={100} interval={0} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <RechartsLegend formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value} />
                  <Bar dataKey="count" fill="var(--color-shares)" radius={[0, 4, 4, 0]} name="shares" barSize={20} />
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-muted-foreground">No hay datos de plataformas compartidas para mostrar.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

