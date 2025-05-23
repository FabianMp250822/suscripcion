
"use client";

import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { MoreHorizontal, Search, Filter, Calendar as CalendarIcon, Eye, Edit, CheckCircle, UploadCloud, FileText, Ban, DollarSign, TrendingUp, PackageSearch, Loader2 } from "lucide-react";
import Image from "next/image";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts";
import { useToast } from "@/hooks/use-toast";

type PaymentStatus = "Pagado" | "Pendiente" | "Fallido" | "En Disputa" | "Verificado" | "Reembolsado";

interface Transaction {
  id: string;
  fecha: string; // Date
  pagadorId?: string;
  pagadorNombre: string;
  pagadorEmail: string;
  pagadorAvatar: string;
  beneficiarioId?: string;
  beneficiarioNombre: string;
  beneficiarioEmail: string;
  beneficiarioAvatar: string;
  listingId?: string;
  servicioNombre: string;
  servicioIcono: string;
  montoPagadoPorPagador: number; // Amount paid by Payer
  gananciaPlataforma: number;    // Platform Fee
  montoParaPropietario: number; // Sharer Payout Amount
  estado: PaymentStatus;
  metodoPago: string;
  comprobanteUrl?: string; // Optional URL for payment proof
}

// No mock data, initialize as empty. Data will come from Firestore.
const initialTransactions: Transaction[] = [];

const getStatusBadgeVariant = (status: PaymentStatus) => {
  switch (status) {
    case "Pagado": return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Pendiente": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    case "Fallido": return "bg-red-500/20 text-red-700 border-red-500/30";
    case "En Disputa": return "bg-orange-500/20 text-orange-700 border-orange-500/30";
    case "Verificado": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Reembolsado": return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    default: return "secondary";
  }
};

const allPaymentStatuses: PaymentStatus[] = ["Pagado", "Pendiente", "Fallido", "En Disputa", "Verificado", "Reembolsado"];
const exampleServices = ["Netflix Premium", "Spotify Duo", "HBO Max", "Disney+", "YouTube Premium"]; // For filter dropdown example

const chartConfig = {
  platformEarnings: { label: "Ganancias Plataforma (€)", color: "hsl(var(--chart-1))" },
  totalVolume: { label: "Volumen Total (€)", color: "hsl(var(--chart-2))" },
};
// Placeholder chart data
const exampleChartData = [
    { month: "Ene", platformEarnings: 150, totalVolume: 1000 },
    { month: "Feb", platformEarnings: 200, totalVolume: 1200 },
    { month: "Mar", platformEarnings: 180, totalVolume: 1100 },
];

export default function PaymentTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [loading, setLoading] = useState(true);
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
  const [newStatusToSet, setNewStatusToSet] = useState<PaymentStatus | "">("");
  const { toast } = useToast();

  useEffect(() => {
    // TODO: Implementar carga de transacciones desde Firestore
    // Ejemplo:
    // const q = query(collection(db, "transactions"), orderBy("fecha", "desc"));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const fetchedTransactions: Transaction[] = [];
    //   querySnapshot.forEach((doc) => {
    //     fetchedTransactions.push({ id: doc.id, ...doc.data() } as Transaction);
    //   });
    //   setTransactions(fetchedTransactions);
    //   setLoading(false);
    // }, (error) => {
    //   console.error("Error fetching transactions: ", error);
    //   toast({ title: "Error al Cargar Transacciones", description: "No se pudieron obtener los datos.", variant: "destructive" });
    //   setLoading(false);
    // });
    // return () => unsubscribe();
    setLoading(false); // Remove this line once Firestore fetching is implemented
  }, [toast]);

  const filteredTransactions = transactions.filter(tx =>
    (tx.pagadorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tx.beneficiarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tx.servicioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filterStatus === "all" || tx.estado === filterStatus) &&
    (filterService === "all" || tx.servicioNombre === filterService) &&
    (!dateRange?.from || new Date(tx.fecha) >= dateRange.from) &&
    (!dateRange?.to || new Date(tx.fecha) <= dateRange.to)
  );

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const handleOpenChangeStatusModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewStatusToSet(transaction.estado);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatusChange = () => {
    if (selectedTransaction && newStatusToSet) {
      // TODO: Implementar actualización de estado en Firestore
      console.log(`Actualizando estado para ${selectedTransaction.id} a ${newStatusToSet}`);
      // Update local state for now (remove when Firestore is connected)
      setTransactions(prev => prev.map(tx => tx.id === selectedTransaction.id ? {...tx, estado: newStatusToSet as PaymentStatus} : tx));
      toast({ title: "Estado Actualizado", description: `El estado de la transacción ${selectedTransaction.id} se cambió a ${newStatusToSet}.` });
      setIsStatusModalOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleMarkAsVerified = (transactionId: string) => {
    // TODO: Implementar marcación como verificado en Firestore
    console.log("Marcando transacción como verificada:", transactionId);
    setTransactions(prev => prev.map(tx => tx.id === transactionId ? {...tx, estado: "Verificado" as PaymentStatus} : tx));
    toast({ title: "Transacción Verificada", description: `La transacción ${transactionId} ha sido marcada como verificada.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transacciones de Pago</h1>
        <p className="text-muted-foreground">Ver y gestionar todas las transacciones de pago de la plataforma.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por Usuario, Servicio, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lg:col-span-2"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger><SelectValue placeholder="Filtrar por Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                {allPaymentStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger><SelectValue placeholder="Filtrar por Servicio" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Servicios</SelectItem>
                {exampleServices.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}
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
                    <span>Selecciona un rango de fechas</span>
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
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-6 w-6 text-primary" /> Estadísticas de Ganancias de la Plataforma</CardTitle>
            <CardDescription>Resumen financiero y tendencias de ingresos de SuscripGrupo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-2 p-4 border rounded-lg bg-muted/50">
                <Label className="text-sm font-medium text-muted-foreground">Ganancias Totales de la Plataforma</Label>
                {/* TODO: Fetch real total platform earnings */}
                <div className="text-3xl font-bold">$0.00</div> 
                <p className="text-xs text-muted-foreground">Calculado de todas las transacciones completadas.</p>
            </div>
             <div className="h-[250px] p-4 border rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                    {/* TODO: Replace with real chart data and configuration */}
                    <RechartsBarChart data={exampleChartData}>
                        <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                        <RechartsTooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                            formatter={(value, name) => [`$${(value as number).toFixed(2)}`, chartConfig[name as keyof typeof chartConfig]?.label || name]}
                        />
                        <RechartsLegend formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value} />
                        <Bar dataKey="platformEarnings" fill="var(--color-platformEarnings)" radius={[4, 4, 0, 0]} name="platformEarnings" />
                        <Bar dataKey="totalVolume" fill="var(--color-totalVolume)" radius={[4, 4, 0, 0]} name="totalVolume" />
                    </RechartsBarChart>
                </ResponsiveContainer>
                <p className="text-center text-sm text-muted-foreground mt-2">Gráfico de ganancias mensuales (datos de ejemplo).</p>
             </div>
          </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Todas las Transacciones</CardTitle>
          <CardDescription>Una lista de todas las transacciones de pago registradas.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <PackageSearch className="mx-auto h-12 w-12 mb-4" />
              No se encontraron transacciones que coincidan con tus criterios.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID Txn</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Pagador</TableHead>
                  <TableHead>Beneficiario (Propietario)</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead className="text-right">Monto Pagado</TableHead>
                  <TableHead className="text-right">Monto Propietario</TableHead>
                  <TableHead className="text-right">Ganancia Plataforma</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                    <TableCell>{tx.fecha}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image src={tx.pagadorAvatar} alt={tx.pagadorNombre} width={24} height={24} className="rounded-full" data-ai-hint="profile avatar" />
                        <div>
                            <div className="font-medium">{tx.pagadorNombre}</div>
                            <div className="text-xs text-muted-foreground">{tx.pagadorEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image src={tx.beneficiarioAvatar} alt={tx.beneficiarioNombre} width={24} height={24} className="rounded-full" data-ai-hint="profile avatar" />
                        <div>
                            <div className="font-medium">{tx.beneficiarioNombre}</div>
                            <div className="text-xs text-muted-foreground">{tx.beneficiarioEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                          <Image src={tx.servicioIcono} alt={tx.servicioNombre} width={24} height={24} className="rounded-sm" data-ai-hint="app logo" />
                          {tx.servicioNombre}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">${tx.montoPagadoPorPagador.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${tx.montoParaPropietario.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">${tx.gananciaPlataforma.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(tx.estado)}>{tx.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(tx)}>
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenChangeStatusModal(tx)}>
                            <Edit className="mr-2 h-4 w-4" /> Cambiar Estado
                          </DropdownMenuItem>
                          {tx.estado !== "Verificado" && tx.estado !== "Pagado" && (
                              <DropdownMenuItem onClick={() => handleMarkAsVerified(tx.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" /> Marcar como Verificado
                              </DropdownMenuItem>
                          )}
                          {tx.estado === "En Disputa" && (
                              <DropdownMenuItem>
                                  <Ban className="mr-2 h-4 w-4" /> Resolver Disputa
                              </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles de la Transacción: {selectedTransaction.id}</DialogTitle>
              <DialogDescription>Vista detallada de la transacción de pago.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-[150px_1fr] items-center gap-x-4 gap-y-2">
                <Label className="text-right font-semibold">Pagador:</Label>
                <div className="flex items-center gap-2">
                    <Image src={selectedTransaction.pagadorAvatar} alt={selectedTransaction.pagadorNombre} width={32} height={32} className="rounded-full" data-ai-hint="profile avatar"/>
                    <span>{selectedTransaction.pagadorNombre} ({selectedTransaction.pagadorEmail})</span>
                </div>
                <Label className="text-right font-semibold">Beneficiario (Propietario):</Label>
                 <div className="flex items-center gap-2">
                    <Image src={selectedTransaction.beneficiarioAvatar} alt={selectedTransaction.beneficiarioNombre} width={32} height={32} className="rounded-full" data-ai-hint="profile avatar"/>
                    <span>{selectedTransaction.beneficiarioNombre} ({selectedTransaction.beneficiarioEmail})</span>
                </div>
                <Label className="text-right font-semibold">Servicio:</Label>
                <div className="flex items-center gap-2">
                    <Image src={selectedTransaction.servicioIcono} alt={selectedTransaction.servicioNombre} width={32} height={32} className="rounded-sm" data-ai-hint="app logo"/>
                    <span>{selectedTransaction.servicioNombre}</span>
                </div>
                <Label className="text-right font-semibold">Monto Pagado (Pagador):</Label>
                <span className="font-semibold">${selectedTransaction.montoPagadoPorPagador.toFixed(2)}</span>
                
                <Label className="text-right font-semibold">Monto para Propietario:</Label>
                <span className="font-semibold">${selectedTransaction.montoParaPropietario.toFixed(2)}</span>
                
                <Label className="text-right font-semibold">Ganancia Plataforma:</Label>
                <span className="font-semibold text-green-600">${selectedTransaction.gananciaPlataforma.toFixed(2)}</span>

                <Label className="text-right font-semibold">Fecha:</Label>
                <span>{selectedTransaction.fecha}</span>
                <Label className="text-right font-semibold">Estado:</Label>
                <Badge className={getStatusBadgeVariant(selectedTransaction.estado)}>{selectedTransaction.estado}</Badge>
                <Label className="text-right font-semibold">Método de Pago:</Label>
                <span>{selectedTransaction.metodoPago}</span>
                <Label className="text-right font-semibold">Comprobante de Pago:</Label>
                {selectedTransaction.comprobanteUrl ? (
                    <Button variant="outline" size="sm" asChild>
                        <a href={selectedTransaction.comprobanteUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" /> Ver Comprobante
                        </a>
                    </Button>
                ) : (
                    <span className="text-muted-foreground">No subido</span>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedTransaction && (
        <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cambiar Estado de Pago</DialogTitle>
              <DialogDescription>Actualizar el estado para la transacción {selectedTransaction.id}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>Estado Actual: <Badge className={getStatusBadgeVariant(selectedTransaction.estado)}>{selectedTransaction.estado}</Badge></p>
              <div>
                <Label htmlFor="newStatusToSet">Nuevo Estado</Label>
                <Select value={newStatusToSet} onValueChange={(value) => setNewStatusToSet(value as PaymentStatus)}>
                  <SelectTrigger id="newStatusToSet"><SelectValue placeholder="Selecciona nuevo estado" /></SelectTrigger>
                  <SelectContent>
                    {allPaymentStatuses.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={handleSaveStatusChange} disabled={!newStatusToSet || newStatusToSet === selectedTransaction.estado}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    