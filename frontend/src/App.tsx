import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ClientPortal from './pages/ClientPortal';
import AdminDashboard from './pages/AdminDashboard';
import MusicPage from './pages/MusicPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoadingScreen from './components/LoadingScreen';
import { useGetCallerUserProfile } from './hooks/useQueries';

type Page = 'home' | 'services' | 'contact' | 'portal' | 'admin' | 'music';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scrollTarget, setScrollTarget] = useState<'services' | 'contact' | null>(null);
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showLoading, setShowLoading] = useState(true);

  const isAuthenticated = !!identity;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Only show profile setup modal if:
  // 1. User is authenticated
  // 2. Profile data has been fetched (not loading)
  // 3. Profile is null (doesn't exist)
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleNavigate = (page: Page) => {
    if (page === 'services' || page === 'contact') {
      // If we're not on the home page, navigate to home first with scroll target
      if (currentPage !== 'home') {
        setScrollTarget(page);
        setCurrentPage('home');
      } else {
        // Already on home, just trigger scroll
        setScrollTarget(page);
      }
    } else {
      setCurrentPage(page);
      setScrollTarget(null);
    }
  };

  // Clear scroll target after it's been used
  useEffect(() => {
    if (scrollTarget && currentPage === 'home') {
      const timer = setTimeout(() => {
        setScrollTarget(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollTarget, currentPage]);

  if (showLoading || isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1">
          {currentPage === 'home' && (
            <LandingPage
              onNavigate={handleNavigate}
              scrollToServices={scrollTarget === 'services'}
              scrollToContact={scrollTarget === 'contact'}
            />
          )}
          {currentPage === 'portal' && <ClientPortal />}
          {currentPage === 'admin' && <AdminDashboard />}
          {currentPage === 'music' && <MusicPage onNavigate={handleNavigate} />}
        </main>
        <Footer />
        {showProfileSetup && <ProfileSetupModal />}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
