import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30 backdrop-blur">
      <div className="container py-6 sm:py-8 px-4 sm:px-6">
        {/* Banner Image - Mobile Responsive */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="w-full">
            <img 
              src="/assets/nebadon encryption logo 1 cut.png" 
              alt="Nebacrypt" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Contact Info - Mobile Optimized */}
        <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <div className="text-sm sm:text-base font-semibold">Nebadon Encryption AS</div>
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <div>Karl Johans gate 25</div>
            <div>0159 OSLO</div>
            <div>Org nr 935 095 123</div>
          </div>
        </div>

        {/* Bottom Bar - Mobile Stacked */}
        <div className="pt-4 sm:pt-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <div className="text-center sm:text-left">
              © {currentYear} Nebadon Encryption – Alle rettigheter forbeholdes
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
      </div>
    </footer>
  );
}
