import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        <img
          src="/assets/nebadon encryption logo 1 cut.png"
          alt="Nebacrypt"
          className="w-64 sm:w-80 h-auto object-contain animate-pulse"
          loading="eager"
        />

        {/* Spinning wheel */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin"
            style={{ animationDuration: '0.9s' }}
          />
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Laster inn...
          </p>
        </div>
      </div>
    </div>
  );
}
