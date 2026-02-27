import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MusicTrackCard from '../components/MusicTrackCard';

type Page = 'home' | 'services' | 'contact' | 'portal' | 'admin' | 'music';

interface MusicPageProps {
  onNavigate: (page: Page) => void;
}

export const SUNO_PROFILE_URL = 'https://suno.com/@nebacrypt';

export const tracks = [
  { title: 'Synthetic Drift', genreTag: 'Ambient Electronic' },
  { title: 'Agondonter Protocol', genreTag: 'Dark Synth' },
  { title: 'Northern Signal', genreTag: 'Nordic Ambient' },
  { title: 'Encrypted Frequencies', genreTag: 'Ethereal Synth' },
  { title: 'Collective Resonance', genreTag: 'Atmospheric' },
  { title: 'Digital Fjord', genreTag: 'Nordic Electronic' },
  { title: 'Phantom Lattice', genreTag: 'Experimental' },
  { title: 'Nebula Cascade', genreTag: 'Space Ambient' },
  { title: 'Cipher Bloom', genreTag: 'Synthwave' },
  { title: 'Polar Transmission', genreTag: 'Cold Wave' },
  { title: 'Recursive Horizon', genreTag: 'Glitch Ambient' },
  { title: 'Agondonter Hymn', genreTag: 'Choral Electronic' },
];

export default function MusicPage({ onNavigate }: MusicPageProps) {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-secondary/5 via-background to-primary/5 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Synthetic Agondonters Collective
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Elektronisk musikk fra dypet av det syntetiske. Utforsk ambient, dark synth og nordisk elektronika produsert av @nebacrypt.
            </p>
            <div className="pt-2">
              <a
                href={SUNO_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Se full profil på Suno
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Track Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                Spor
              </h2>
              <span className="text-sm text-muted-foreground">{tracks.length} spor</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {tracks.map((track, index) => (
                <MusicTrackCard
                  key={index}
                  title={track.title}
                  genreTag={track.genreTag}
                  sunoUrl={SUNO_PROFILE_URL}
                />
              ))}
            </div>
            <div className="mt-10 sm:mt-12 text-center">
              <a
                href={SUNO_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Åpne Suno-profil
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Back navigation */}
      <div className="container mx-auto px-4 sm:px-6 pb-12">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbake til forsiden
        </button>
      </div>
    </div>
  );
}
