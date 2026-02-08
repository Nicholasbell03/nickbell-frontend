import { Badge } from '@/components/ui/badge';
import { Store } from 'lucide-react';
import {
  SiLaravel,
  SiPhp,
  SiJavascript,
  SiTypescript,
  SiVuedotjs,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiVite,
  SiHtml5,
  SiTailwindcss,
  SiAmazonwebservices,
  SiDocker,
  SiFigma,
  SiReact,
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import type { LucideIcon } from 'lucide-react';

type TechItem = {
  name: string;
  icon: IconType | LucideIcon;
};

const techStack: TechItem[] = [
  { name: 'Laravel', icon: SiLaravel },
  { name: 'PHP', icon: SiPhp },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'Vue.js', icon: SiVuedotjs },
  { name: 'MySQL', icon: SiMysql },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'Pinia', icon: Store },
  { name: 'Redis', icon: SiRedis },
  { name: 'Vite', icon: SiVite },
  { name: 'HTML', icon: SiHtml5 },
  { name: 'Tailwind', icon: SiTailwindcss },
  { name: 'AWS', icon: SiAmazonwebservices },
  { name: 'Docker', icon: SiDocker },
  { name: 'Figma', icon: SiFigma },
  { name: 'React', icon: SiReact },
];

export function TechStack() {
  return (
    <section className="py-16 md:py-24 px-4 bg-background/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Tech Stack</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Some of the technologies I like to work with
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {techStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="group"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <Badge
                  variant="outline"
                  className="w-full py-4 px-4 justify-center gap-2 text-base border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-default"
                >
                  <Icon className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  {tech.name}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
