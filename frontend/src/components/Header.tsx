import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../hooks/useQueries';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Page = 'home' | 'services' | 'contact' | 'portal' | 'admin';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, refetch: refetchAdminStatus, isLoading: isAdminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  useEffect(() => {
    if (isAuthenticated && !isAdminLoading) {
      const timer = setTimeout(() => {
        refetchAdminStatus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAdminLoading, refetchAdminStatus]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onNavigate('home');
    } else {
      try {
        await login();
        setTimeout(() => {
          refetchAdminStatus();
        }, 500);
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  // Determine active state for navigation items
  const getActiveState = (page: Page) => {
    if (page === 'services' || page === 'contact') {
      // Services and Contact are active when on home page
      return currentPage === 'home' || currentPage === page;
    }
    return currentPage === page;
  };

  const navItems = [
    { label: 'Hjem', page: 'home' as Page },
    { label: 'Tjenester', page: 'services' as Page },
    { label: 'Kontakt', page: 'contact' as Page },
    { label: 'Kundeportal', page: 'portal' as Page },
  ];

  if (isAuthenticated && isAdmin === true) {
    navItems.push({ label: 'Admin Dashboard', page: 'admin' as Page });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => handleNavigation('home')}
          className="flex items-center hover:opacity-80 transition-opacity"
          aria-label="Gå til forsiden"
        >
          <span className="text-sm font-semibold text-foreground">Nebacrypt</span>
        </button>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                getActiveState(item.page) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAuth}
                  disabled={disabled}
                  variant={isAuthenticated ? 'outline' : 'default'}
                  className="hidden md:inline-flex"
                  size="sm"
                >
                  {loginStatus === 'logging-in' ? 'Logger inn...' : isAuthenticated ? 'Logg ut' : 'Logg inn'}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-sm">
                  Se prosjektstatus og administrer innsendinger trygt med Internet Identity
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground touch-manipulation"
            aria-label={mobileMenuOpen ? 'Lukk meny' : 'Åpne meny'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container py-4 px-4 sm:px-6 flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigation(item.page)}
                className={`text-left text-base font-medium transition-colors hover:text-primary py-2 touch-manipulation ${
                  getActiveState(item.page) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleAuth}
                disabled={disabled}
                variant={isAuthenticated ? 'outline' : 'default'}
                className="w-full touch-manipulation"
                size="lg"
              >
                {loginStatus === 'logging-in' ? 'Logger inn...' : isAuthenticated ? 'Logg ut' : 'Logg inn'}
              </Button>
              <p className="text-xs text-muted-foreground text-center px-2 leading-relaxed">
                Se prosjektstatus og administrer innsendinger trygt med Internet Identity
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
