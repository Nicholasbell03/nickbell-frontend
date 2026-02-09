import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  SiLaravel,
  SiPhp,
  SiTypescript,
  SiVuedotjs,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiVite,
  SiTailwindcss,
  SiAmazonwebservices,
  SiDocker,
  SiReact,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

type TechItem = {
  name: string;
  icon: IconType;
};

const techStack: TechItem[] = [
  { name: 'Laravel', icon: SiLaravel },
  { name: 'PHP', icon: SiPhp },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'Vue.js', icon: SiVuedotjs },
  { name: 'React', icon: SiReact },
  { name: 'MySQL', icon: SiMysql },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'Redis', icon: SiRedis },
  { name: 'Vite', icon: SiVite },
  { name: 'Tailwind', icon: SiTailwindcss },
  { name: 'AWS', icon: SiAmazonwebservices },
  { name: 'Docker', icon: SiDocker },
];

export function TechStack() {
  return (
    <Card className="border-emerald-500/20 h-full md:col-span-2">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                  className="w-full py-3.5 px-4 justify-center gap-2.5 text-base border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-default"
                >
                  <Icon className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  {tech.name}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
