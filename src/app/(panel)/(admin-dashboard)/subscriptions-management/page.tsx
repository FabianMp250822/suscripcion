
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";

export default function SubscriptionsManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Suscripciones</h1>
          <p className="text-muted-foreground">Define y gestiona los niveles y categorías de suscripción de la plataforma.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Nivel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Crear Nuevo Nivel de Suscripción</CardTitle>
            <CardDescription>Añade un nuevo plan de suscripción a tu plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tierName">Nombre del Nivel</Label>
              <Input id="tierName" placeholder="Ej: Plan Premium, Nivel Básico" />
            </div>
            <div>
              <Label htmlFor="price">Precio (USD por mes)</Label>
              <Input id="price" type="number" placeholder="Ej: 9.99" />
            </div>
            <div>
              <Label htmlFor="description">Descripción del Nivel</Label>
              <Textarea id="description" placeholder="Describe brevemente este nivel y sus beneficios principales para los usuarios." />
            </div>
            <div className="space-y-2">
              <Label>Características Incluidas</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="featureUnlimitedAccess" />
                <Label htmlFor="featureUnlimitedAccess" className="font-normal">Acceso Ilimitado al Contenido</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="featureHDStreaming" />
                <Label htmlFor="featureHDStreaming" className="font-normal">Streaming en Alta Definición (HD)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="featureAdFree" />
                <Label htmlFor="featureAdFree" className="font-normal">Experiencia sin Anuncios Publicitarios</Label>
              </div>
              {/* Puedes añadir más checkboxes para otras características comunes o un sistema más dinámico */}
            </div>
            <Button className="w-full">Crear Nivel de Suscripción</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Niveles Existentes</CardTitle>
            <CardDescription>Gestiona los planes de suscripción actuales de la plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: Implementar la carga y visualización de niveles existentes desde Firestore */}
            <div className="border border-dashed border-border rounded-md p-8 text-center">
              <p className="text-muted-foreground">Aún no se han creado niveles de suscripción, o la lista aparecerá aquí.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
