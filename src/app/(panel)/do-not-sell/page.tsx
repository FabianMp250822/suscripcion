
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DoNotSellPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">No Vender ni Compartir Mi Información Personal</CardTitle>
          </div>
          <CardDescription>
            Comprende tus derechos con respecto a la venta o compartición de tu información personal bajo las leyes de privacidad aplicables (ej., CCPA/CPRA) en SuscripGrupo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            En SuscripGrupo, estamos comprometidos con la protección de tu privacidad. No "vendemos" tu información personal en el sentido tradicional, como intercambiarla por una compensación monetaria.
          </p>
          <p>
            Sin embargo, bajo ciertas leyes de privacidad como la Ley de Privacidad del Consumidor de California (CCPA) / Ley de Derechos de Privacidad de California (CPRA), el término "vender" también puede incluir el intercambio de información personal con terceros para beneficios no monetarios, como para publicidad conductual intercontextual o ciertos tipos de análisis.
          </p>
          
          <h3 className="text-lg font-semibold">Tu Derecho a Optar por la Exclusión</h3>
          <p>
            Tienes el derecho de optar por la exclusión de la "venta" o "compartición" de tu información personal. Si eliges optar por la exclusión, nos abstendremos de compartir tu información con terceros de maneras que puedan considerarse una "venta" o "compartición" bajo estas leyes.
          </p>
          <p>
            Para ejercer tu derecho de exclusión, por favor utiliza uno de los siguientes métodos:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Control de Privacidad Global (GPC):</strong> Honramos la señal de Control de Privacidad Global. Si tu navegador o extensión de navegador transmite la señal GPC, la trataremos automáticamente como una solicitud válida para optar por la exclusión de la venta o compartición de tu información personal para ese navegador. Puedes aprender más sobre GPC en <Link href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">globalprivacycontrol.org <ExternalLink className="inline-block h-3 w-3 ml-0.5" /></Link>.
            </li>
            <li>
              <strong>Enviar una Solicitud:</strong> Puedes enviar una solicitud de exclusión contactando a nuestro equipo de privacidad en <Link href="mailto:privacidad@suscripgrupo.example.com" className="text-primary hover:underline">privacidad@suscripgrupo.example.com</Link>. Por favor, incluye suficiente información para que podamos identificarte en nuestros sistemas.
            </li>
          </ul>

          <h3 className="text-lg font-semibold">Agentes Autorizados</h3>
          <p>
            Puedes designar un agente autorizado para realizar una solicitud de exclusión en tu nombre. Requeriremos prueba escrita del permiso del agente para hacerlo y podríamos verificar tu identidad directamente.
          </p>

          <p className="text-sm text-muted-foreground">
            Ten en cuenta que optar por la exclusión puede afectar tu experiencia con ciertas funciones o anuncios personalizados. Para más detalles sobre cómo manejamos tu información personal, por favor revisa nuestra <Link href="/privacy-policy" className="text-primary hover:underline">Política de Privacidad</Link> completa.
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
