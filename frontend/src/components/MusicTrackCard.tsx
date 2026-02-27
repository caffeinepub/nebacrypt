import { ExternalLink, Music } from 'lucide-react';

interface MusicTrackCardProps {
  title: string;
  genreTag: string;
  sunoUrl: string;
}

export default function MusicTrackCard({ title, genreTag, sunoUrl }: MusicTrackCardProps) {
  return (
    <a
      href={sunoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-lg flex items-center justify-center group-hover:from-primary/25 group-hover:to-secondary/25 transition-all duration-200">
        <Music className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors duration-200 truncate">
          {title}
        </h3>
        <span className="inline-block text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
          {genreTag}
        </span>
      </div>
      <ExternalLink className="flex-shrink-0 h-4 w-4 text-muted-foreground/50 group-hover:text-primary/70 transition-colors duration-200 mt-0.5" />
    </a>
  );
}
