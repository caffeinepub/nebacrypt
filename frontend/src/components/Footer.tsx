import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30 backdrop-blur">
      <div className="container py-6 sm:py-8 px-4 sm:px-6">
        {/* Banner Image - Reduced size */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="w-full max-w-xs sm:max-w-sm">
            <img
              src="/assets/nebadon encryption logo 1 cut.png"
              alt="Nebacrypt"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pb-4 sm:pb-6 border-b border-border/40 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <div className="text-center sm:text-left">
              © {currentYear} – Alle rettigheter forbeholdes
            </div>
            <div className="flex items-center gap-2">
              <span>Bygget med</span>
              <Heart className="h-3 w-3 text-destructive fill-destructive" />
              <span>ved</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'unknown-app')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>

        {/* nencrypt.com - centered */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <a
            href="https://nencrypt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors font-medium"
          >
            nencrypt.com
          </a>
        </div>

        {/* Contact Info - Org nr left, Address right */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="text-center sm:text-left">
            Org nr 935 095 123
          </div>
          <div className="text-center sm:text-right space-y-1">
            <div>Karl Johans gate 25</div>
            <div>0159 OSLO</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
