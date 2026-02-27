import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Mail, MapPin, Phone, Music, Globe, ChevronRight } from 'lucide-react';

type Page = 'home' | 'services' | 'contact' | 'portal' | 'admin' | 'music' | 'icp-info';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  scrollToServices?: boolean;
  scrollToContact?: boolean;
}

export default function LandingPage({ onNavigate, scrollToServices, scrollToContact }: LandingPageProps) {
  const servicesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
        style={{
          backgroundImage: "url('/assets/generated/image (1).jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="flex justify-center mb-6 sm:mb-8">
              <img
                src="/assets/nebadon encryption logo 1 cut (1)-1.png"
                alt="Nebadon Encryption Logo"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed px-4">
              Spesialist i veiledning av kunstig intelligens. Tilbyr instrukser og skreddersydde løsninger for privat og profesjonell bruk. Produserer nettsider og apper bygget med toppmoderne serverteknologi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={() => onNavigate('portal')}
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Kundeportal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('music')}
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-md hover:shadow-lg transition-all bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white"
              >
                <Music className="mr-2 h-5 w-5" />
                Musikk
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ICP Teaser Section */}
      <section className="py-14 sm:py-18 border-t border-border/30 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
                  <Globe className="h-3.5 w-3.5" />
                  Teknologi
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  Bygget på Internet Computer Protocol
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Denne nettsiden kjører på ICP – en blokkjede som lar deg bygge hele applikasjoner
                  uten tradisjonelle servere. Ingen AWS, ingen Google Cloud. Bare kode som lever
                  direkte på et desentralisert nettverk.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  ICP kombinerer hastigheten til moderne skytjenester med sikkerheten og åpenheten
                  til blokkjedeteknologi – og gjør det mulig å lage produkter der brukerne faktisk
                  eier dataene sine.
                </p>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('icp-info')}
                  className="rounded-full mt-2 border-accent/40 text-accent hover:bg-accent/10 hover:text-accent"
                >
                  Les mer om ICP
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div
                className="relative rounded-2xl overflow-hidden border border-border/30 shadow-lg cursor-pointer group"
                onClick={() => onNavigate('icp-info')}
              >
                <img
                  src="/assets/generated/icp-network.dim_1200x500.png"
                  alt="Internet Computer Protocol nettverksvisualisering"
                  className="w-full h-52 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white drop-shadow-md">Informasjon om vår teknologi</span>
                  <span className="w-8 h-8 rounded-full bg-accent/80 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-white" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-16 sm:py-20 md:py-24 border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Kontakt oss
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Vi er klare til å hjelpe deg med ditt neste prosjekt
              </p>
            </div>
            <Card className="border-border/40">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1">E-post</h3>
                      <a
                        href="mailto:ceo@nebacrypt.com"
                        className="text-sm text-accent hover:underline break-all"
                      >
                        ceo@nebacrypt.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1">Telefon</h3>
                      <a
                        href="tel:+4748442420"
                        className="text-sm text-accent hover:underline"
                      >
                        +47 48 442 420
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1">Adresse</h3>
                      <p className="text-sm text-muted-foreground">
                        Nebadon Encryption AS<br />
                        Postboks 2, 3139 SKALLESTAD<br />
                        Norge
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-border/30">
                  <Button
                    size="lg"
                    onClick={() => onNavigate('portal')}
                    className="w-full rounded-full shadow-md hover:shadow-lg transition-all"
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
