
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Términos de Servicio de SuscripGrupo</CardTitle>
          </div>
          <CardDescription>
            Por favor, lee estos términos y condiciones cuidadosamente antes de usar Nuestro Servicio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Interpretación y Definiciones</h2>
          <p>
            Las palabras cuya letra inicial está en mayúscula tienen significados definidos bajo las siguientes condiciones. Las siguientes definiciones tendrán el mismo significado independientemente de si aparecen en singular o en plural.
          </p>
          
          <h3 className="text-lg font-semibold">Definiciones</h3>
          <p>Para los propósitos de estos Términos de Servicio:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Afiliado</strong> significa una entidad que controla, es controlada por, o está bajo control común con una parte, donde "control" significa la propiedad del 50% o más de las acciones, participación accionaria u otros valores con derecho a voto para la elección de directores u otra autoridad administrativa.</li>
            <li><strong>País</strong> se refiere a: Tu País</li>
            <li><strong>Compañía</strong> (referida como "la Compañía", "Nosotros", "Nos" o "Nuestro" en este Acuerdo) se refiere a SuscripGrupo, propiedad de tecnosalud internacional.</li>
            <li><strong>Dispositivo</strong> significa cualquier dispositivo que pueda acceder al Servicio, como una computadora, un teléfono celular o una tableta digital.</li>
            <li><strong>Servicio</strong> se refiere al Sitio Web.</li>
            <li><strong>Términos y Condiciones</strong> (también referidos como "Términos") significan estos Términos y Condiciones que forman el acuerdo completo entre Tú y la Compañía con respecto al uso del Servicio.</li>
            <li><strong>Servicio de Redes Sociales de Terceros</strong> significa cualquier servicio o contenido (incluyendo datos, información, productos o servicios) proporcionado por un tercero que pueda ser mostrado, incluido o puesto a disposición por el Servicio.</li>
            <li><strong>Sitio Web</strong> se refiere a SuscripGrupo, accesible desde [URL de tu Sitio Web, ej. https://suscripgrupo.example.com]</li>
            <li><strong>Tú</strong> significa el individuo que accede o usa el Servicio, o la compañía u otra entidad legal en nombre de la cual dicho individuo accede o usa el Servicio, según corresponda.</li>
          </ul>

          <h2 className="text-xl font-semibold">Reconocimiento</h2>
          <p>
            Estos son los Términos y Condiciones que rigen el uso de este Servicio y el acuerdo que opera entre Tú y la Compañía. Estos Términos y Condiciones establecen los derechos y obligaciones de todos los usuarios con respecto al uso del Servicio.
          </p>
          <p>
            Tu acceso y uso del Servicio está condicionado a Tu aceptación y cumplimiento de estos Términos y Condiciones. Estos Términos y Condiciones se aplican a todos los visitantes, usuarios y otras personas que accedan o usen el Servicio.
          </p>
          <p>
            Al acceder o usar el Servicio, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos Términos y Condiciones, entonces no puedes acceder al Servicio.
          </p>
          
          <p className="text-sm text-muted-foreground pt-4">
            Este es un documento de Términos de Servicio de ejemplo. En una aplicación real, contendría términos legales exhaustivos.
          </p>

          <div className="pt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/">Volver a la Página Principal</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
