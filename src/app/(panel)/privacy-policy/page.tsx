
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Política de Privacidad de SuscripGrupo</CardTitle>
          </div>
          <CardDescription>
            Tu privacidad es importante para nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos tu información cuando visitas nuestro sitio web SuscripGrupo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Información que Recopilamos</h2>
          <p>
            Podemos recopilar información de identificación personal (Nombre, dirección de correo electrónico, número de teléfono, etc.) de los Usuarios de diversas maneras, incluyendo, pero no limitado a, cuando los Usuarios visitan nuestro sitio, se registran en el sitio, realizan un pedido, se suscriben al boletín informativo, responden a una encuesta, llenan un formulario, y en conexión con otras actividades, servicios, características o recursos que ponemos a disposición en nuestro Servicio.
          </p>
          
          <h3 className="text-lg font-semibold">Cómo Usamos Tu Información</h3>
          <p>Podemos usar la información que recopilamos de las siguientes maneras:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Para personalizar la experiencia del usuario y permitirnos entregar el tipo de contenido y ofertas de productos en los que estás más interesado.</li>
            <li>Para mejorar nuestro sitio web con el fin de servirte mejor.</li>
            <li>Para permitirnos servirte mejor al responder a tus solicitudes de servicio al cliente.</li>
            <li>Para administrar un concurso, promoción, encuesta u otra característica del sitio.</li>
            <li>Para procesar rápidamente tus transacciones.</li>
            <li>Para enviar correos electrónicos periódicos sobre tu pedido u otros productos y servicios.</li>
          </ul>

          <h2 className="text-xl font-semibold">Compartir Tu Información Personal</h2>
          <p>
            No vendemos, intercambiamos ni alquilamos la información de identificación personal de los Usuarios a otros. Podemos compartir información demográfica agregada genérica no vinculada a ninguna información de identificación personal sobre visitantes y usuarios con nuestros socios comerciales, afiliados de confianza y anunciantes para los fines descritos anteriormente.
          </p>
          
          <h2 className="text-xl font-semibold">Contactándonos</h2>
          <p>
            Si tienes alguna pregunta sobre esta Política de Privacidad, las prácticas de este sitio, o tus tratos con este sitio, por favor contáctanos en:
          </p>
          <p>
            SuscripGrupo (por tecnosalud internacional)<br />
            [Dirección de tu Compañía]<br />
            <Link href="mailto:privacidad@suscripgrupo.example.com" className="text-primary hover:underline">privacidad@suscripgrupo.example.com</Link>
          </p>

          <p className="text-sm text-muted-foreground pt-4">
            Este es un documento de Política de Privacidad de ejemplo. En una aplicación real, contendría términos legales exhaustivos sobre la privacidad de los datos.
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
