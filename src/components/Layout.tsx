import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ChatPanel } from './ChatPanel';
import { ChatWidget } from './ChatWidget';

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatPanel />
      <ChatWidget />
    </div>
  );
}
