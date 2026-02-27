import { ExternalLink, Music } from 'lucide-react';

interface MusicTrackCardProps {
  genreTag: string;
  sunoUrl: string;
  title?: string;
  artist?: string;
}

/**
 * Extracts a human-readable title from a Suno URL.
 *
 * Handles two URL formats:
 *  - Slug-based:  https://suno.com/song/my-song-title-<uuid>
 *  - Short-link:  https://suno.com/s/<id>
 *
 * For slug-based URLs the slug portion (everything before the trailing UUID
 * segment) is converted from kebab-case to Title Case.
 * For short-link URLs the raw ID is returned as-is.
 */
export function parseTitleFromSunoUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split('/').filter(Boolean);

    // Slug-based: /song/<slug-with-possible-uuid>
    if (parts[0] === 'song' && parts[1]) {
      const slug = parts[1];
      // A UUID segment is 8-4-4-4-12 hex chars; strip it from the end if present
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const segments = slug.split('-');
      // Check if the last 5 segments form a UUID
      const possibleUuid = segments.slice(-5).join('-');
      const titleSegments = uuidPattern.test(possibleUuid)
        ? segments.slice(0, -5)
        : segments;

      if (titleSegments.length > 0) {
        return titleSegments
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
    }

    // Short-link: /s/<id>  — use the ID directly
    if (parts[0] === 's' && parts[1]) {
      return parts[1];
    }

    // Fallback: last path segment
    const last = parts[parts.length - 1];
    return last
      ? last
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ')
      : 'Ukjent spor';
  } catch {
    return 'Ukjent spor';
  }
}

export default function MusicTrackCard({ genreTag, sunoUrl, title: titleProp, artist }: MusicTrackCardProps) {
  const title = titleProp ?? parseTitleFromSunoUrl(sunoUrl);

  return (
    <a
      href={sunoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-4 sm:p-5 rounded-lg border border-border/40 bg-card hover:border-accent/40 hover:bg-card/80 transition-all duration-200 cursor-pointer"
    >
      <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-accent/10 rounded-md flex items-center justify-center group-hover:bg-accent/20 transition-all duration-200">
        <Music className="h-5 w-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-medium text-foreground leading-snug mb-0.5 group-hover:text-accent transition-colors duration-200 truncate">
          {title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {artist && (
            <span className="text-xs text-muted-foreground/90 font-medium">{artist}</span>
          )}
          {artist && (
            <span className="text-xs text-muted-foreground/40">·</span>
          )}
          <span className="inline-block text-xs text-muted-foreground/70">
            {genreTag}
          </span>
        </div>
      </div>
      <ExternalLink className="flex-shrink-0 h-4 w-4 text-muted-foreground/30 group-hover:text-accent/60 transition-colors duration-200" />
    </a>
  );
}
