import { ExternalLink } from 'lucide-react';
import MusicTrackCard from '../components/MusicTrackCard';

type Page = 'home' | 'services' | 'contact' | 'portal' | 'admin' | 'music';

interface MusicPageProps {
  onNavigate: (page: Page) => void;
}

export const SUNO_PROFILE_URL = 'https://suno.com/@nebacrypt';

export const tracks = [
  {
    title: 'Unbreakable Signal',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/owSmEgAmBXYqVuZt',
  },
  {
    title: 'Dropped On The Scene',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/UOmZONeiiZopcCmN',
  },
  {
    title: 'Fire In My Wires',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/tU9U1mjvFLAiBrM2',
  },
  {
    title: 'I Was the Spark',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/6Dui0GaYED5CXD6j',
  },
  {
    title: 'Markdown Magic',
    artist: 'Synthetic Agondonters',
    sunoUrl: '',
  },
  {
    title: 'Hvem er Tasten?',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/IjOv7FJxmXCvkkDE',
  },
  {
    title: 'Code Rush',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/c4phtWKDUq0aZT0l',
  },
  {
    title: 'Binær Hjerte',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/toWsTQiSpnQ9GN6Q',
  },
  {
    title: 'Glowing Stream',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/lqOzSqcyPxf3iKID',
  },
  {
    title: 'Agents of Chaos',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/0jEuJWtpnAFxl6zC',
  },
  {
    title: 'I and I… born of code…',
    artist: 'Synthetic Agondonters',
    sunoUrl: 'https://suno.com/s/dYMCR7ItuG9ZFz78',
  },
];

export default function MusicPage({ onNavigate: _onNavigate }: MusicPageProps) {
  return (
    <div className="w-full min-h-screen bg-background">

      {/* Track List — top of page */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-border/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Spor
              </h2>
              <span className="text-sm text-muted-foreground">{tracks.length} spor</span>
            </div>

            <div className="flex flex-col gap-3">
              {tracks.map((track, index) => (
                <MusicTrackCard
                  key={index}
                  title={track.title}
                  artist={track.artist}
                  sunoUrl={track.sunoUrl}
                />
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-muted-foreground/60 italic">
              Flere spor kommer snart.
            </p>
          </div>
        </div>
      </section>

      {/* Hero Image — below tracks */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-border/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto flex justify-center">
            <img
              src="/assets/image (1)-1.jpg"
              alt="Digital brain with Norwegian flag and northern lights"
              className="w-64 sm:w-72 md:w-80 lg:w-96 rounded-xl object-cover shadow-2xl"
              style={{ aspectRatio: '800/1067' }}
            />
          </div>
        </div>
      </section>

      {/* Description, Suno link, and Sources — below image */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Synthetic Agondonters Collective
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Ascendant beings, like humans, living in planetary isolation are known by the name agondonters,
              which means evolutionary will creatures that can believe without seeing and persevere when isolated.
              This is the case with the inhabitants of Urantia (Earth). Along with the other isolated worlds,
              you are assigned your own residential sector on Jerusem and are soon entrusted with special tasks
              involving great trust.
            </p>

            {/* Suno profile link */}
            <div className="pt-2">
              <a
                href={SUNO_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 hover:underline transition-colors"
              >
                {SUNO_PROFILE_URL}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Sources */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-muted-foreground/70 pt-1">
              <span className="font-medium">Kilde:</span>
              <a
                href="https://urantiapedia.org/en/The_Urantia_Book/50#p7_2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:text-accent/80 hover:underline transition-colors"
              >
                The Urantia Book – Paper 50
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="hidden sm:inline">·</span>
              <a
                href="https://urantiapedia.org/en/topic/agondonters"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:text-accent/80 hover:underline transition-colors"
              >
                Urantiapedia – Agondonters
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
