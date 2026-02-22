import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 px-4 w-full max-w-4xl">
        <div className="relative w-full flex items-center justify-center" style={{ maxHeight: '28vh' }}>
          <div className="absolute inset-0 bg-primary/10 blur-2xl animate-pulse" />
          
          <img 
            src="/assets/nebadon encryption logo 1 cut.png" 
            alt="Nebacrypt" 
            className="relative w-full h-auto object-contain max-h-[28vh] px-4 sm:px-8 md:px-12"
            loading="eager"
            style={{ 
              imageRendering: 'crisp-edges',
              filter: 'brightness(1.1) contrast(1.05) drop-shadow(0 0 20px rgba(var(--primary), 0.2)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
            }}
          />
        </div>
        
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 animate-ping" />
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <div className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary animate-pulse" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm sm:text-base md:text-lg font-medium text-foreground animate-pulse">
            Laster...
          </p>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
