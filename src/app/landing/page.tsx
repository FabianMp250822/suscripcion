
import type { Metadata } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Briefcase, Users, DollarSign, ShieldCheck, MessageCircle, Search, CreditCard, Lock, Zap, Award } from 'lucide-react';
import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Firebase Subscription Hub: Comparte y Ahorra en Suscripciones',
  description: 'Ahorra hasta un 70% en servicios como Netflix, Spotify y más, conectando con personas de confianza. Comparte tus suscripciones de forma segura.',
  keywords: 'compartir suscripciones, dividir gastos, ahorrar suscripciones, netflix compartido, spotify familiar, hbo max grupo, disney plus compartido, youtube premium familiar, plataforma de suscripciones',
  openGraph: {
    title: 'Firebase Subscription Hub: Comparte y Ahorra en Suscripciones',
    description: 'Ahorra hasta un 70% en servicios como Netflix, Spotify y más, conectando con personas de confianza.',
    url: 'https://your-platform-url.com/landing', // Replace with your actual URL
    siteName: 'Firebase Subscription Hub',
    images: [
      {
        url: 'https://your-platform-url.com/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'Firebase Subscription Hub - Comparte Suscripciones',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Firebase Subscription Hub: Comparte y Ahorra en Suscripciones',
    description: 'Ahorra hasta un 70% en servicios como Netflix, Spotify y más, conectando con personas de confianza.',
    // site: '@yourtwitterhandle', // Replace with your Twitter handle if any
    images: ['https://your-platform-url.com/twitter-image.png'], // Replace with your actual Twitter image URL
  },
  alternates: {
    canonical: 'https://your-platform-url.com/landing', // Replace with your actual URL
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
    question: "¿Cómo puedo compartir mi suscripción?",
    answer: "1. Publicas los detalles de tu suscripción de forma segura en nuestra plataforma. 2. Estableces el precio por cupo y el número de participantes. 3. Aceptas a los interesados y recibes el pago directamente a través de nuestro sistema seguro.",
    value: "item-1",
  },
  {
    question: "¿Es seguro unirme a un grupo?",
    answer: "¡Sí! Priorizamos tu seguridad. Verificamos a los usuarios proveedores y tu pago está protegido. Nuestro sistema de arbitraje garantiza tu acceso durante todo el ciclo de pago o te ayudamos a resolver cualquier inconveniente.",
    value: "item-2",
  },
  {
    question: "¿Qué pasa si alguien no paga o abusa del servicio?",
    answer: "Como propietario, puedes iniciar una disputa si un participante no cumple con los pagos o abusa de la cuenta. Como participante, si se te revoca el acceso injustamente, también puedes abrir una disputa. Nuestro equipo de arbitraje mediará para una resolución justa.",
    value: "item-3",
  },
  {
    question: "¿Qué tipos de suscripciones puedo compartir o encontrar?",
    answer: "Puedes compartir y encontrar una amplia variedad de servicios digitales, como plataformas de streaming (Netflix, HBO Max, Disney+), música (Spotify, Apple Music), software, herramientas de productividad, ¡y mucho más!",
    value: "item-4",
  }
];

const availableSubscriptionsMock = [
  { id: "s1", name: "Netflix Premium", type: "Cupo en Plan Familiar 4K", price: 3.99, currency: "USD", availability: "2 cupos disponibles", icon: "https://placehold.co/80x80.png?text=N", dataAiHint: "netflix logo" },
  { id: "s2", name: "Spotify Premium", type: "Lugar en Plan Dúo", price: 2.75, currency: "USD", availability: "1 cupo disponible", icon: "https://placehold.co/80x80.png?text=S", dataAiHint: "spotify logo" },
  { id: "s3", name: "HBO Max Standard", type: "Acceso Compartido", price: 4.50, currency: "USD", availability: "3 cupos disponibles", icon: "https://placehold.co/80x80.png?text=H", dataAiHint: "hbo logo" },
  { id: "s4", name: "Disney+ Anual", type: "Cupo en Plan Familiar", price: 2.00, currency: "USD", availability: "SOLD OUT", icon: "https://placehold.co/80x80.png?text=D", dataAiHint: "disney logo" },
];

const trustPillars = [
  { title: "Pagos Protegidos", description: "Utilizamos pasarelas de pago cifradas y seguras para proteger cada transacción.", icon: Lock },
  { title: "Garantía de Acceso", description: "Nuestro sistema de arbitraje asegura tu acceso o te ayudamos a resolverlo.", icon: ShieldCheck },
  { title: "Comunidad Verificada", description: "Fomentamos un ambiente de confianza con perfiles de usuario claros.", icon: Users },
  { title: "Soporte Dedicado", description: "Nuestro equipo está aquí para ayudarte con cualquier consulta o disputa.", icon: MessageCircle },
];

export default function LandingPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Firebase Subscription Hub",
    "url": "https://your-platform-url.com", // Replace with your actual URL
    "logo": "https://your-platform-url.com/logo.png", // Replace with your actual logo URL
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-XXX-XXX-XXXX", // Optional
      "contactType": "Customer Support",
      "email": "soporte@firebasesubscriptionhub.example.com"
    },
    "sameAs": [ // Optional: social media links
      // "https://www.facebook.com/yourplatform",
      // "https://www.twitter.com/yourplatform",
      // "https://www.linkedin.com/company/yourplatform"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Firebase Subscription Hub",
    "url": "https://your-platform-url.com/landing", // Replace with your actual URL
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://your-platform-url.com/browse-groups?q={search_term_string}", // Replace
      "query-input": "required name=search_term_string"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Plataforma de intermediación para compartir suscripciones",
    "provider": {
      "@type": "Organization",
      "name": "Firebase Subscription Hub"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Global" // Or specify countries
    },
    "description": "Conecta con personas para compartir gastos de suscripciones a servicios digitales como Netflix, Spotify, y más, de forma segura y económica.",
    "name": "Compartir Suscripciones Digitales"
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
    "name": `${sub.name} - ${sub.type}`,
    "description": `Acceso compartido para ${sub.name}. ${sub.availability}.`,
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
        "name": "Firebase Subscription Hub (Plataforma Intermediaria)"
      }
    },
    "mainEntityOfPage": { // Optional, but good for linking back
        "@type": "WebPage",
        "@id": `https://your-platform-url.com/browse-groups/${sub.id}` // Replace with actual group URL
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

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x1080.png/e0f2fe/334257?text=Tech+Collage')" }} data-ai-hint="digital services collage">
          <div className="container mx-auto px-4 bg-black/30 dark:bg-black/50 py-10 rounded-xl backdrop-blur-sm">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Plataforma para Compartir Suscripciones y <span className="text-primary">Dividir Gastos</span> de Forma Segura
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto">
              Ahorra hasta un 70% en servicios como Netflix, Spotify y más, conectando con personas de confianza y gestionando tus grupos de forma sencilla.
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">¿Cómo Funciona?</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Suscripciones Populares</h2>
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
                      <Badge 
                        variant={sub.availability.toLowerCase().includes("sold out") ? "destructive" : "default"}
                        className={sub.availability.toLowerCase().includes("sold out") ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300"}
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
                        <Search className="mr-2" /> Ver Todos los Grupos
                    </Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Trust Pillars Section */}
        <section id="trust-pillars" className="py-16 md:py-24 bg-background dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Tu Confianza es Nuestra Prioridad</h2>
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
                <h3 className="text-2xl font-semibold text-foreground mb-3">¿Listo para Empezar?</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Únete a miles de usuarios que ya están ahorrando y compartiendo sus suscripciones favoritas de manera inteligente.</p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Link href="/login">
                        <Zap className="mr-2" /> ¡Crear Cuenta Ahora!
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
                    <h2 className="text-3xl font-bold text-foreground mb-4">Sobre Nosotros</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        En <span className="font-semibold text-primary">Firebase Subscription Hub</span>, nuestra misión es hacer que el acceso a tus servicios digitales favoritos sea más asequible y colaborativo. Creemos en el poder de compartir para desbloquear un mayor valor para todos. Facilitamos conexiones seguras para que puedas disfrutar más, gastando menos.
                    </p>
                    <h3 className="text-2xl font-semibold text-foreground mb-3">Contáctanos</h3>
                    <p className="text-muted-foreground">
                        ¿Preguntas? ¿Sugerencias? Estamos aquí para ayudar.
                    </p>
                    <p className="text-muted-foreground mt-1">
                        Email: <a href="mailto:soporte@firebasesubscriptionhub.example.com" className="text-primary hover:underline">soporte@firebasesubscriptionhub.example.com</a>
                    </p>
                    {/* <p className="text-muted-foreground mt-1">Dirección: 123 Calle Ficticia, Ciudad, País (Si aplica)</p> */}
                </Card>
            </div>
        </section>
      </div>
    </>
  );
}
