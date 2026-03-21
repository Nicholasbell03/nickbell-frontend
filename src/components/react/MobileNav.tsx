import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';
import Contact from './Contact';

const navItems = [
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Shares', path: '/shares' },
];

interface MobileNavProps {
  pathname: string;
}

export default function MobileNav({ pathname }: MobileNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden border-t border-emerald-500/20 bg-background/98">
          <div className="container mx-auto max-w-7xl px-4 py-4 space-y-2">
            <SearchBar mobile onNavigate={() => setMobileMenuOpen(false)} />
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive(item.path)
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'hover:text-emerald-400 hover:bg-emerald-500/5'
                  }`}
                >
                  {item.name}
                </Button>
              </a>
            ))}
            <div className="pt-2">
              <Contact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
