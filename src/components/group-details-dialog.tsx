"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, DollarSign, ShoppingCart, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface GroupListing {
  id: string;
  serviceName: string;
  spotsAvailable: number;
  totalSpots: number;
  pricePerSpot: number;
  listingDescription?: string;
  status: string;
  iconUrl: string;
  sharerName?: string;
  sharerAvatar?: string;
  ownerReputation?: number;
  totalRatings?: number;
  sharerId?: string;
}

interface GroupDetailsDialogProps {
  group: GroupListing;
  children: React.ReactNode;
}

const StarRating = ({ rating, totalRatings }: { rating?: number; totalRatings?: number }) => {
  if (typeof rating !== 'number' || rating < 0) {
    return <p className="text-xs text-muted-foreground">Sin calificaciones</p>;
  }
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && <Star key="half" className="h-4 w-4 text-yellow-400 fill-yellow-200" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
      ))}
      {totalRatings !== undefined && <span className="ml-1 text-xs text-muted-foreground">({totalRatings})</span>}
    </div>
  );
};

export function GroupDetailsDialog({ group, children }: GroupDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  const isOwnListing = !!user && group.sharerId === user.uid;
  const buttonDisabled = group.status === 'Full' || group.spotsAvailable === 0 || isOwnListing;
  
  // Calcular precio base y tarifa de servicio
  const basePrice = group.pricePerSpot * 0.87; // Asumiendo que el precio incluye una comisión del 15%
  const serviceFee = group.pricePerSpot - basePrice;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-start gap-4">
            <Image 
              src={group.iconUrl} 
              alt={group.serviceName} 
              width={72} 
              height={72} 
              className="rounded-lg object-contain" 
            />
            <div className="flex-1">
              <DialogTitle className="text-2xl">{group.serviceName}</DialogTitle>
              <DialogDescription className="mt-1">
                Compartido por: {group.sharerName}
              </DialogDescription>
              <div className="mt-2">
                <Badge 
                  className={
                    group.status === 'Recruiting' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' : 
                    group.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' :
                    'bg-destructive/20 text-destructive border-destructive/30'
                  }
                >
                  {group.status === 'Full' || group.spotsAvailable === 0 ? 'Lleno' : `${group.spotsAvailable} lugar${group.spotsAvailable !== 1 ? 'es' : ''} disponible${group.spotsAvailable !== 1 ? 's' : ''}`}
                </Badge>
              </div>
              <div className="mt-2">
                <StarRating rating={group.ownerReputation} totalRatings={group.totalRatings} />
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Sección de precio */}
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <DollarSign className="h-5 w-5 mr-1 text-green-600" />
              Detalles de precio
            </h3>
            <div className="grid grid-cols-2 text-sm">
              <span className="text-muted-foreground">Precio base:</span>
              <span className="text-right font-medium">${basePrice.toFixed(2)}</span>
              
              <span className="text-muted-foreground">Tarifa de servicio (SuscripGrupo):</span>
              <span className="text-right font-medium">${serviceFee.toFixed(2)}</span>
              
              <span className="font-semibold pt-2">Total mensual:</span>
              <span className="text-right font-bold text-lg pt-2">${group.pricePerSpot.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Sección de disponibilidad */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Users className="h-5 w-5 mr-1 text-blue-600" />
              Disponibilidad
            </h3>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${((group.totalSpots - group.spotsAvailable) / group.totalSpots) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-center">
                {group.totalSpots - group.spotsAvailable} de {group.totalSpots} lugares ocupados
              </p>
            </div>
          </div>
          
          {/* Descripción */}
          {group.listingDescription && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-sm whitespace-pre-wrap">{group.listingDescription}</p>
            </div>
          )}
          
          {/* Información del propietario */}
          <div className="border rounded-lg p-4 flex items-center space-x-3">
            <Image 
              src={group.sharerAvatar || 'https://placehold.co/40x40.png?text=S'} 
              alt={group.sharerName || "Sharer"} 
              width={40} 
              height={40} 
              className="rounded-full" 
            />
            <div>
              <p className="font-medium">{group.sharerName}</p>
              <p className="text-xs text-muted-foreground">Propietario del grupo</p>
            </div>
          </div>
          
          {/* Información importante */}
          <div className="border rounded-lg p-4 bg-orange-50">
            <h3 className="text-md font-semibold flex items-center text-orange-700">
              <AlertCircle className="h-4 w-4 mr-1" />
              Información importante
            </h3>
            <ul className="text-sm mt-2 space-y-1 text-orange-700">
              <li className="flex items-start">
                <CheckCircle className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                <span>Al unirte, aceptas las reglas del grupo y los términos de servicio.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                <span>El acceso a la cuenta compartida se proporcionará tras la confirmación del pago.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                <span>Los pagos son mensuales y se procesarán a través de una pasarela segura.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="mt-6 space-y-2 sm:space-y-0">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          {isOwnListing ? (
            <Button variant="outline" asChild>
              <Link href={`/manage-group/${group.id}`}>
                Administrar tu publicación
              </Link>
            </Button>
          ) : (
            <Button 
              disabled={buttonDisabled} 
              asChild
            >
              <Link href={`/join-group/${group.id}`}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {buttonDisabled ? 'Grupo Lleno' : 'Unirse al Grupo'}
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}