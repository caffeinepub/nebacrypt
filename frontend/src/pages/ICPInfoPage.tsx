import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Globe,
  Shield,
  Cpu,
  Network,
  Layers,
  Zap,
  Lock,
  Code2,
  Building2,
  Users,
  Coins,
  Image,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

type Page = 'home' | 'services' | 'contact' | 'portal' | 'admin' | 'music' | 'icp-info';

interface ICPInfoPageProps {
  onNavigate: (page: Page) => void;
}

const techPillars = [
  {
    icon: <Cpu className="h-6 w-6" />,
    title: 'Canister Smart Contracts',
    description:
      'Canisters er neste generasjons smarte kontrakter – de kjører WebAssembly-kode direkte på blokkjeden og kan lagre data, betjene nettsider og håndtere millioner av brukere uten tradisjonell serverinfrastruktur.',
    badge: 'WebAssembly',
  },
  {
    icon: <Network className="h-6 w-6" />,
    title: 'Subnets',
    description:
      'ICP er organisert i uavhengige subnets – grupper av noder som samarbeider om å kjøre canisters. Denne arkitekturen gir horisontal skalering: jo flere subnets, desto mer kapasitet for hele nettverket.',
    badge: 'Skalerbarhet',
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'Chain-Key Kryptografi',
    description:
      'En banebrytende kryptografisk protokoll som lar ICP signere transaksjoner og kommunisere med andre blokkjeder (som Bitcoin og Ethereum) uten broer eller mellommenn. Grunnlaget for sann interoperabilitet.',
    badge: 'Kryptografi',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Network Nervous System (NNS)',
    description:
      'ICP styres av et åpent, algoritmisk styringssystem kalt NNS. Token-innehavere kan stemme på oppgraderinger, legge til nye noder og forme nettverkets fremtid – uten sentralisert kontroll.',
    badge: 'Governance',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Reverse Gas Model',
    description:
      'I motsetning til Ethereum betaler ikke sluttbrukerne transaksjonsgebyrer. Utviklere lader opp canisters med «cycles» (drivstoff), slik at appene er gratis å bruke – akkurat som vanlige nettsider.',
    badge: 'UX-vennlig',
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: 'Internet Identity',
    description:
      'ICP tilbyr et innebygd, passordløst autentiseringssystem basert på WebAuthn. Brukere logger inn med biometri eller hardware-nøkler – ingen passord, ingen e-post, ingen sentralisert identitetsleverandør.',
    badge: 'Autentisering',
  },
];

const useCases = [
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Desentraliserte apper (dApps)',
    description:
      'Bygg fullstendige webapplikasjoner – frontend, backend og database – som kjører 100 % på blokkjeden. Ingen AWS, ingen Google Cloud, ingen enkeltpunkt for sensur eller nedetid.',
    examples: ['Sosiale medier', 'Produktivitetsverktøy', 'Markedsplasser'],
  },
  {
    icon: <Coins className="h-8 w-8" />,
    title: 'DeFi og finansielle tjenester',
    description:
      'Desentralisert finans på ICP kombinerer lav latens, høy gjennomstrømning og direkte Bitcoin/Ethereum-integrasjon via chain-key kryptografi – uten broer som kan hackes.',
    examples: ['DEX-er', 'Utlånsprotokoll', 'Stablecoins'],
  },
  {
    icon: <Image className="h-8 w-8" />,
    title: 'NFT og digitale eiendeler',
    description:
      'NFT-er på ICP lagrer faktisk medieinnholdet on-chain – ikke bare en lenke til en ekstern server. Det betyr at kunsten din eksisterer for alltid, uavhengig av tredjeparter.',
    examples: ['Digitale samleobjekter', 'Spillelementer', 'Musikk-NFT'],
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: 'Sosiale medier og kommunikasjon',
    description:
      'Plattformer som OpenChat og DSCVR viser at sosiale nettverk kan drives uten sentraliserte servere – brukerne eier dataene sine, og ingen kan slette innhold vilkårlig.',
    examples: ['Meldingsapper', 'Innholdsplattformer', 'DAO-forum'],
  },
  {
    icon: <Building2 className="h-8 w-8" />,
    title: 'Enterprise og offentlig sektor',
    description:
      'Bedrifter bruker ICP til å bygge transparente forsyningskjeder, digitale identitetsløsninger og samarbeidsverktøy der revisjon og etterprøvbarhet er kritisk.',
    examples: ['Forsyningskjede', 'Digital ID', 'Offentlige registre'],
  },
  {
    icon: <Code2 className="h-8 w-8" />,
    title: 'AI og maskinlæring on-chain',
    description:
      'Med ICP kan AI-modeller kjøres direkte i canisters – noe som åpner for verifiserbar, transparent AI der ingen enkelt aktør kontrollerer modellen eller dataene.',
    examples: ['On-chain inferens', 'Desentralisert trening', 'AI-agenter'],
  },
];

export default function ICPInfoPage({ onNavigate }: ICPInfoPageProps) {
  return (
    <div className="w-full">
      {/* Back navigation */}
      <div className="container mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbake til forsiden
        </button>
      </div>

      {/* Hero / Introduction Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/assets/generated/icp-network.dim_1200x500.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="text-accent border-accent/40 px-4 py-1 text-sm">
              Teknologiinformasjon
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Internet Computer Protocol
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Hva om internett ikke trengte servere? ICP er en blokkjede som lar deg bygge og kjøre
              hele applikasjoner – frontend, backend og database – direkte på et desentralisert nettverk.
              Ingen skytjenester. Ingen mellommenn. Bare kode som lever på kjeden.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              {['Desentralisert', 'Skalerbar', 'Åpen kildekode', 'Web3-nativ'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-wider">
                  <Globe className="h-4 w-4" />
                  Introduksjon
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Et nytt fundament for internett
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Internet Computer Protocol (ICP) er utviklet av DFINITY Foundation og lansert i 2021.
                  Visjonen er radikal: å bygge en blokkjede som kan erstatte tradisjonell IT-infrastruktur
                  og la utviklere lage alt fra enkle nettsider til komplekse finansielle systemer – uten
                  å stole på Amazon, Google eller Microsoft.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Der Bitcoin er digitale penger og Ethereum er en plattform for smarte kontrakter,
                  er ICP en fullstendig datamaskin på kjeden. Det betyr at koden din kjører direkte
                  i nettverket, med garantert oppetid, åpen kildekode og ingen enkelt aktør som kan
                  stenge deg ute.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  For bedrifter og utviklere betyr dette lavere kostnader, høyere sikkerhet og
                  muligheten til å bygge produkter som brukerne faktisk eier og kontrollerer.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border/30">
                <img
                  src="/assets/generated/icp-network.dim_1200x500.png"
                  alt="ICP nettverksvisualisering"
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs text-white/80 font-medium">
                    ICP-nettverket består av hundrevis av noder spredt over hele verden
                  </p>
                </div>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {[
                { value: '2021', label: 'Lansert' },
                { value: '~1s', label: 'Transaksjonstid' },
                { value: '100%', label: 'On-chain hosting' },
                { value: '∞', label: 'Skalerbarhet' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-muted/50 border border-border/30"
                >
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-12 sm:py-16 border-t border-border/30 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-wider">
                <Cpu className="h-4 w-4" />
                Arkitektur
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Teknologien bak ICP
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                ICP er bygget på en rekke banebrytende teknologier som til sammen gjør det mulig
                å kjøre hele applikasjoner på en desentralisert infrastruktur – med ytelse og
                brukervennlighet på nivå med tradisjonelle skytjenester.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {techPillars.map((pillar) => (
                <Card key={pillar.title} className="border-border/40 hover:border-accent/30 transition-colors">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                        {pillar.icon}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base">
                            {pillar.title}
                          </h3>
                          <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                            {pillar.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Technical note */}
            <div className="mt-8 p-5 rounded-xl border border-accent/20 bg-accent/5">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    Teknisk merknad: Threshold Signature Scheme (TSS)
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Chain-key kryptografi bruker en avansert variant av terskel-signaturer der ingen
                    enkelt node kjenner den private nøkkelen. Signaturer genereres kollektivt av
                    subnettets noder via BLS-kryptografi – noe som gjør systemet motstandsdyktig
                    mot kompromitterte noder og muliggjør direkte integrasjon med Bitcoin og Ethereum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 sm:py-16 border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-wider">
                <Users className="h-4 w-4" />
                Bruksområder
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Hva kan du bygge med ICP?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Fra sosiale medier til finansielle tjenester – ICP åpner for en ny generasjon
                applikasjoner der brukerne eier dataene sine og ingen enkelt aktør sitter med makten.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {useCases.map((useCase) => (
                <Card key={useCase.title} className="border-border/40 hover:border-accent/30 transition-colors group">
                  <CardContent className="p-5 sm:p-6 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                      {useCase.icon}
                    </div>
                    <h3 className="font-semibold text-foreground">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {useCase.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {useCase.examples.map((ex) => (
                        <span
                          key={ex}
                          className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center space-y-4 p-8 rounded-2xl border border-border/40 bg-muted/30">
              <h3 className="text-xl font-bold text-foreground">
                Klar til å bygge på ICP?
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                Nebacrypt hjelper deg med å realisere prosjekter på Internet Computer – fra idé til
                ferdig produkt. Ta kontakt for en uforpliktende samtale.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  size="lg"
                  onClick={() => onNavigate('portal')}
                  className="rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Start et prosjekt
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('contact')}
                  className="rounded-full"
                >
                  Kontakt oss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* External resources */}
      <section className="py-10 border-t border-border/30 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Lær mer
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'DFINITY Foundation', url: 'https://dfinity.org' },
                { label: 'ICP Developer Docs', url: 'https://internetcomputer.org/docs' },
                { label: 'Internet Computer Wiki', url: 'https://wiki.internetcomputer.org' },
                { label: 'ICP Dashboard', url: 'https://dashboard.internetcomputer.org' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                >
                  {link.label}
                  <ChevronRight className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
