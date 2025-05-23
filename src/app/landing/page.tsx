
import type { Metadata } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, DollarSign, ShieldCheck, MessageCircle, Search, CreditCard, Lock, Zap, Award } from 'lucide-react';
import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'SuscripGrupo: Comparte y Ahorra en Suscripciones',
  description: 'Ahorra hasta un 70% en servicios como Netflix, Spotify y más, conectando con personas de confianza. Comparte tus suscripciones de forma segura con SuscripGrupo.',
  keywords: 'suscripgrupo, compartir suscripciones, dividir gastos, ahorrar suscripciones, netflix compartido, spotify familiar, hbo max grupo, disney plus compartido, youtube premium familiar, plataforma de suscripciones',
  openGraph: {
    title: 'SuscripGrupo: Comparte y Ahorra en Suscripciones',
    description: 'Ahorra hasta un 70% en servicios como Netflix, Spotify y más, conectando con personas de confianza en SuscripGrupo.',
    url: 'https://suscripgrupo.example.com/landing', // Replace with your actual URL
    siteName: 'SuscripGrupo',
    images: [
      {
        url: 'https://suscripgrupo.example.com/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'SuscripGrupo - Comparte Suscripciones',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SuscripGrupo: Comparte y Ahorra en Suscripciones',
    description: 'Ahorra hasta un 70% en servicios como Netflix, Spotify y más, conectando con personas de confianza en SuscripGrupo.',
    // site: '@yourtwitterhandle', // Replace with your Twitter handle if any
    images: ['https://suscripgrupo.example.com/twitter-image.png'], // Replace with your actual Twitter image URL
  },
  alternates: {
    canonical: 'https://suscripgrupo.example.com/landing', // Replace with your actual URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


const faqItems = [
  {
    question: "¿Cómo puedo compartir mi suscripción en SuscripGrupo?",
    answer: "1. Publicas los detalles de tu suscripción de forma segura en nuestra plataforma. 2. Estableces el precio que deseas recibir por cupo. 3. Aceptas a los interesados y recibes el pago (menos una pequeña tarifa de servicio) directamente a través de nuestro sistema seguro.",
    value: "item-1",
  },
  {
    question: "¿Es seguro unirme a un grupo en SuscripGrupo?",
    answer: "¡Sí! Priorizamos tu seguridad. Verificamos a los usuarios proveedores y tu pago está protegido. Ves el precio final, que incluye una tarifa de servicio transparente para SuscripGrupo. Nuestro sistema de arbitraje garantiza tu acceso durante todo el ciclo de pago.",
    value: "item-2",
  },
  {
    question: "¿Qué pasa si alguien no paga o abusa del servicio?",
    answer: "Como propietario, puedes iniciar una disputa si un participante no cumple con los pagos o abusa de la cuenta. Como participante, si se te revoca el acceso injustamente, también puedes abrir una disputa. Nuestro equipo de arbitraje mediará para una resolución justa.",
    value: "item-3",
  },
  {
    question: "¿Qué tipos de suscripciones puedo compartir o encontrar en SuscripGrupo?",
    answer: "Puedes compartir y encontrar una amplia variedad de servicios digitales, como plataformas de streaming (Netflix, HBO Max, Disney+), música (Spotify, Apple Music), software, herramientas de productividad, ¡y mucho más!",
    value: "item-4",
  }
];

// Prices here reflect FINAL PRICE to participant (Sharer's desired price + service fee)
const availableSubscriptionsMock = [
  { id: "s1", name: "Netflix Premium", type: "Cupo en Plan Familiar 4K", price: 4.70, currency: "USD", availability: "2 cupos disponibles", icon: "https://placehold.co/80x80.png/E50914/FFFFFF?text=N", dataAiHint: "netflix logo" },
  { id: "s2", name: "Spotify Premium", type: "Lugar en Plan Dúo", price: 3.25, currency: "USD", availability: "1 cupo disponible", icon: "https://placehold.co/80x80.png/1ED760/FFFFFF?text=S", dataAiHint: "spotify logo" },
  { id: "s3", name: "HBO Max Standard", type: "Acceso Compartido", price: 5.30, currency: "USD", availability: "3 cupos disponibles", icon: "https://placehold.co/80x80.png/7E4FF6/FFFFFF?text=H", dataAiHint: "hbo logo" },
  { id: "s4", name: "Disney+ Anual", type: "Cupo en Plan Familiar", price: 2.35, currency: "USD", availability: "SOLD OUT", icon: "https://placehold.co/80x80.png/0063E5/FFFFFF?text=D", dataAiHint: "disney logo" },
];

const trustPillars = [
  { title: "Pagos Protegidos", description: "Utilizamos pasarelas de pago cifradas y seguras (Stripe) para proteger cada transacción.", icon: Lock },
  { title: "Garantía de Acceso", description: "Nuestro sistema de arbitraje asegura tu acceso o te ayudamos a resolverlo.", icon: ShieldCheck },
  { title: "Comunidad Verificada", description: "Fomentamos un ambiente de confianza con perfiles de usuario claros.", icon: Users },
  { title: "Soporte Dedicado", description: "Nuestro equipo está aquí para ayudarte con cualquier consulta o disputa.", icon: MessageCircle },
];

export default function LandingPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SuscripGrupo",
    "url": "https://suscripgrupo.example.com", // Replace with your actual URL
    "logo": "https://suscripgrupo.example.com/logo.png", // Replace with your actual logo URL
    "parentOrganization": { 
        "@type": "Organization",
        "name": "tecnosalud internacional"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-XXX-XXX-XXXX", // Optional
      "contactType": "Customer Support",
      "email": "soporte@tecnolsalud.cloud"
    },
    "sameAs": [ 
      // "https://www.facebook.com/yourplatform",
      // "https://www.twitter.com/yourplatform",
      // "https://www.linkedin.com/company/yourplatform"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SuscripGrupo",
    "url": "https://suscripgrupo.example.com/landing", // Replace with your actual URL
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://suscripgrupo.example.com/browse-groups?q={search_term_string}", // Replace
      "query-input": "required name=search_term_string"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Plataforma de intermediación para compartir suscripciones",
    "provider": {
      "@type": "Organization",
      "name": "SuscripGrupo"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Global" // Or specify countries
    },
    "description": "Conecta con personas para compartir gastos de suscripciones a servicios digitales como Netflix, Spotify, y más, de forma segura y económica en SuscripGrupo.",
    "name": "Compartir Suscripciones Digitales en SuscripGrupo"
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const productSchemaExample = availableSubscriptionsMock.slice(0, 2).map(sub => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${sub.name} - ${sub.type} (Cupo en SuscripGrupo)`,
    "description": `Acceso compartido para ${sub.name}. ${sub.availability}. Ofrecido en SuscripGrupo. Precio final, incluye tarifa de servicio.`,
    "image": sub.icon,
    "brand": {
      "@type": "Brand",
      "name": sub.name.split(" ")[0] // Extracts "Netflix" from "Netflix Premium"
    },
    "offers": {
      "@type": "Offer",
      "price": sub.price.toString(),
      "priceCurrency": sub.currency,
      "availability": sub.availability.toLowerCase().includes("sold out") ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "SuscripGrupo (Plataforma Intermediaria)"
      }
    },
    "mainEntityOfPage": { 
        "@type": "WebPage",
        "@id": `https://suscripgrupo.example.com/browse-groups/${sub.id}` // Replace with actual group URL
    }
  }));


  return (
    <>
      <Head>
        {/* Structured Data Scripts */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
        {productSchemaExample.map((schema, index) => (
          <script key={`product-schema-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
      </Head>

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-sky-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x1080.png/41a7fc/FFFFFF?text=Servicios+Digitales')" }} data-ai-hint="digital services collage abstract">
          <div className="container mx-auto px-4 bg-black/40 dark:bg-black/60 py-10 rounded-xl backdrop-blur-sm">
            <Link href="/" className="inline-block mx-auto mb-6">
              <Icons.Logo className="h-20 w-20 text-primary transition-transform duration-300 hover:scale-110" />
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              SuscripGrupo: Plataforma para Compartir Suscripciones y <span className="text-primary">Dividir Gastos</span> de Forma Segura
            </h1>
            <p className="text-lg md:text-xl text-slate-100 dark:text-slate-200 mb-10 max-w-3xl mx-auto">
              Ahorra hasta un 70% en servicios como Netflix, Spotify y más, conectando con personas de confianza y gestionando tus grupos de forma sencilla en SuscripGrupo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Link href="/browse-groups">
                  <Search className="mr-2" /> Explorar Grupos
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Link href="/login">
                  <Users className="mr-2" /> Registrarse para Ahorrar
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-background dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">¿Cómo Funciona SuscripGrupo?</h2>
              <p className="text-lg text-muted-foreground mt-2">Compartir y unirse a grupos es simple y seguro.</p>
            </div>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-card p-6 rounded-xl shadow-xl">
              {faqItems.map((item) => (
                <AccordionItem value={item.value} key={item.value}>
                  <AccordionTrigger className="text-lg font-semibold hover:text-primary text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base pt-2">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Available Subscriptions Section */}
        <section id="available-subscriptions" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Suscripciones Populares en SuscripGrupo</h2>
              <p className="text-lg text-muted-foreground mt-2">Descubre algunos de los servicios que puedes compartir o unirte.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {availableSubscriptionsMock.map((sub) => (
                <Card key={sub.id} className="shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden rounded-xl border-border">
                  <CardHeader className="p-0">
                    <Image
                      src={sub.icon}
                      alt={sub.name}
                      width={400}
                      height={200}
                      className="w-full h-40 object-contain p-4 bg-slate-100 dark:bg-slate-700"
                      data-ai-hint={sub.dataAiHint}
                    />
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{sub.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{sub.type}</p>
                    <div className="mt-auto">
                      <p className="text-2xl font-bold text-primary mb-1">${sub.price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/mes</span></p>
                       <p className="text-xs text-muted-foreground">(Precio final. Incluye tarifa de servicio.)</p>
                      <Badge
                        variant={sub.availability.toLowerCase().includes("sold out") ? "destructive" : "default"}
                        className={`${sub.availability.toLowerCase().includes("sold out") ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300"} mt-1`}
                      >
                        {sub.availability}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t">
                     <Button className="w-full bg-primary hover:bg-primary/90" asChild disabled={sub.availability.toLowerCase().includes("sold out")}>
                        <Link href={`/browse-groups?service=${encodeURIComponent(sub.name)}`}>
                            Ver Detalles
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/browse-groups">
                        <Search className="mr-2" /> Ver Todos los Grupos en SuscripGrupo
                    </Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Trust Pillars Section */}
        <section id="trust-pillars" className="py-16 md:py-24 bg-background dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Tu Confianza es Nuestra Prioridad en SuscripGrupo</h2>
              <p className="text-lg text-muted-foreground mt-2">Construimos una plataforma segura y fiable para ti.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trustPillars.map((pillar) => (
                <Card key={pillar.title} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <pillar.icon className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm">{pillar.description}</p>
                </Card>
              ))}
            </div>
             <div className="mt-12 text-center border-t pt-8">
                <h3 className="text-2xl font-semibold text-foreground mb-3">¿Listo para Empezar con SuscripGrupo?</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Únete a miles de usuarios que ya están ahorrando y compartiendo sus suscripciones favoritas de manera inteligente.</p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Link href="/login">
                        <Zap className="mr-2" /> ¡Crear Cuenta Ahora en SuscripGrupo!
                    </Link>
                </Button>
            </div>
          </div>
        </section>
         {/* Who We Are & Contact Section */}
        <section id="about-contact" className="py-16 bg-slate-100 dark:bg-slate-800">
            <div className="container mx-auto px-4 text-center">
                <Card className="max-w-3xl mx-auto p-8 shadow-xl rounded-lg">
                    <Icons.Logo className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-foreground mb-4">Sobre SuscripGrupo</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        En <span className="font-semibold text-primary">SuscripGrupo</span>, nuestra misión es hacer que el acceso a tus servicios digitales favoritos sea más asequible y colaborativo. Creemos en el poder de compartir para desbloquear un mayor valor para todos. Facilitamos conexiones seguras para que puedas disfrutar más, gastando menos. SuscripGrupo es una plataforma de <span className="font-semibold">tecnosalud internacional</span>.
                    </p>
                    <h3 className="text-2xl font-semibold text-foreground mb-3">Contáctanos</h3>
                    <p className="text-muted-foreground">
                        ¿Preguntas? ¿Sugerencias? Estamos aquí para ayudar.
                    </p>
                    <p className="text-muted-foreground mt-1">
                        Email: <a href="mailto:soporte@tecnolsalud.cloud" className="text-primary hover:underline">soporte@tecnolsalud.cloud</a>
                    </p>
                    {/* <p className="text-muted-foreground mt-1">Dirección: 123 Calle Ficticia, Ciudad, País (Si aplica)</p> */}
                </Card>
            </div>
        </section>
      </div>
    </>
  );
}

    