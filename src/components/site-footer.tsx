
import Link from 'next/link';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 p-4 text-center text-sm text-muted-foreground md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p>
            &copy; {currentYear} Firebase Subscription Hub. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4">
          <Link href="/terms-of-service" className="hover:text-foreground hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:text-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="/do-not-sell" className="hover:text-foreground hover:underline">
            Do Not Sell or Share My Personal Information
          </Link>
        </nav>
      </div>
    </footer>
  );
}
