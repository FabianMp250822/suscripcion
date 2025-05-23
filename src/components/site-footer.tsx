
import Link from 'next/link';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 p-4 text-center text-sm text-muted-foreground md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p>
            &copy; {currentYear} SuscripGrupo por tecnosalud internacional. Todos los derechos reservados.
          </p>
        </div>
        <nav className="flex gap-4">
          <Link href="/terms-of-service" className="hover:text-foreground hover:underline">
            Términos de Servicio
          </Link>
          <Link href="/privacy-policy" className="hover:text-foreground hover:underline">
            Política de Privacidad
          </Link>
          <Link href="/do-not-sell" className="hover:text-foreground hover:underline">
            No Vender ni Compartir mi Información Personal
          </Link>
        </nav>
      </div>
    </footer>
  );
}
