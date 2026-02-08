import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/Nicholasbell03' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/nicholas-j-bell' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/nickbell03' },
  { name: 'Email', icon: Mail, url: 'mailto:nicholasbell03@gmail.com' },
];

export function Footer() {
  return (
    <footer className="border-t border-emerald-500/20 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} Nicholas Bell. Powered by Laravel & React.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                  asChild
                >
                  <a
                    href={link.url}
                    target={link.name !== 'Email' ? '_blank' : undefined}
                    rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
