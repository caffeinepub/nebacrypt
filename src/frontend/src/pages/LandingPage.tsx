import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mail, MapPin, Phone, Shield, Lock } from 'lucide-react';

type Page = 'home' | 'services' | 'contact' | 'portal' | 'admin';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  scrollToServices?: boolean;
  scrollToContact?: boolean;
}

export default function LandingPage({ onNavigate, scrollToServices, scrollToContact }: LandingPageProps) {
  const servicesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Unified scroll effect for both services and contact sections
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (scrollToServices && servicesRef.current) {
      timeoutId = setTimeout(() => {
        servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (scrollToContact && contactRef.current) {
      timeoutId = setTimeout(() => {
        contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [scrollToServices, scrollToContact]);

  const services = [
    {
      icon: '/assets/generated/ai-brain-icon-transparent.dim_64x64.png',
      title: 'Iterativ AI-veiledning',
      description: 'Kontinuerlig strategisk AI-tilpasning og optimalisering for bedrifter og privatpersoner. Vi hjelper deg med å implementere og utvikle AI-løsninger som vokser med dine behov.',
      alt: 'AI-hjerne ikon',
    },
    {
      icon: '/assets/generated/code-app-icon-transparent.dim_64x64.png',
      title: 'Web App-utvikling og Vedlikehold',
      description: 'Fullsyklus utvikling og vedlikehold av web-applikasjoner tilpasset profesjonell og sikker ytelse for både bedrifter og privatpersoner. Fra konsept til kontinuerlig drift.',
      alt: 'Kode og app ikon',
    },
    {
      icon: '/assets/generated/decentralized-network-icon-transparent.dim_64x64.png',
      title: 'Desentralisert Hosting',
      description: 'Pionertjenester for hosting bygget på Internet Computer. Pålitelighet og uavhengighet fra tradisjonelle skyleverandører for alle klienter.',
      alt: 'Desentralisert nettverk ikon',
    },
  ];

  const whyChooseItems = [
    {
      icon: '/assets/generated/ai-brain-icon-transparent.dim_64x64.png',
      title: 'Strategisk AI-tilpasning',
      description: 'Vi leverer skreddersydde AI-løsninger som vokser med din virksomhet, fra konsept til kontinuerlig optimalisering.',
      alt: 'AI-hjerne ikon',
    },
    {
      icon: '/assets/generated/decentralized-network-icon-transparent.dim_64x64.png',
      title: 'Desentralisert infrastruktur',
      description: 'Hosting på Internet Computer gir deg uavhengighet fra tradisjonelle skyleverandører og økt pålitelighet.',
      alt: 'Desentralisert nettverk ikon',
    },
    {
      icon: '/assets/generated/security-lock-icon-transparent.dim_32x32.png',
      title: 'Sikkerhet i fokus',
      description: 'Kryptering og sikkerhet er integrert i alle våre løsninger for å beskytte dine data og applikasjoner.',
      alt: 'Sikkerhetslås ikon',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/generated/liquid-glass-bg-quarter-height.dim_1920x270.png')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="flex justify-center mb-6 sm:mb-8">
              <img 
                src="/assets/generated/nebacrypt-hero-logo-transparent.dim_300x300.png" 
                alt="Nebacrypt Logo" 
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Nebacrypt AI & Utviklingstjenester
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Iterativ AI-veiledning, web app-utvikling og desentralisert hosting på Internet Computer. 
              Vi leverer skreddersydde løsninger for bedrifter og privatpersoner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                onClick={() => onNavigate('portal')}
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Kom i gang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate('services')}
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Se tjenester
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-16 sm:py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Våre tjenester
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Skreddersydde løsninger for moderne utfordringer
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                    <img 
                      src={service.icon} 
                      alt={service.alt}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-center">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base text-center leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Nebacrypt Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Hvorfor velge Nebacrypt?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Vi kombinerer ekspertise, innovasjon og sikkerhet
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {whyChooseItems.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center space-y-4 p-6 sm:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center shadow-md">
                  <img 
                    src={item.icon} 
                    alt={item.alt}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-16 sm:py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Kontakt oss
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Vi er klare til å hjelpe deg med ditt neste prosjekt
              </p>
            </div>
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">E-post</h3>
                      <a 
                        href="mailto:ceo@nebacrypt.com" 
                        className="text-sm sm:text-base text-primary hover:underline break-all"
                      >
                        ceo@nebacrypt.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Telefon</h3>
                      <a 
                        href="tel:+4797510101" 
                        className="text-sm sm:text-base text-primary hover:underline"
                      >
                        +47 975 10 101
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Adresse</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Nebadon Encryption AS<br />
                        Org.nr: 933 468 654<br />
                        Norge
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
                  <Button 
                    size="lg" 
                    onClick={() => onNavigate('portal')}
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    Send inn prosjektforespørsel
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
