/**
 * TechStack React island — kept as React for react-icons.
 * Receives data as props from the Astro page (fetched server-side).
 */
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
import type { Technology } from '@/types/technology';

const iconMap: Partial<Record<string, IconType>> = {
  laravel: SiLaravel,
  php: SiPhp,
  typescript: SiTypescript,
  'vue-js': SiVuedotjs,
  vuejs: SiVuedotjs,
  vue: SiVuedotjs,
  'vue.js': SiVuedotjs,
  react: SiReact,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  redis: SiRedis,
  vite: SiVite,
  tailwind: SiTailwindcss,
  aws: SiAmazonwebservices,
  docker: SiDocker,
};

interface Props {
  technologies: Technology[];
}

export default function TechStack({ technologies }: Props) {
  if (!technologies || technologies.length === 0) {
    return (
      <Card className="border-emerald-500/20 h-full">
        <CardContent className="p-6" />
      </Card>
    );
  }

  return (
    <Card className="border-emerald-500/20 h-full">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {technologies.map((tech, index) => {
            const Icon = iconMap[tech.slug];
            return (
              <div
                key={tech.slug}
                className="group"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <Badge
                  variant="outline"
                  className="w-full py-3.5 px-4 justify-center gap-2.5 text-base border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-default"
                >
                  {Icon && (
                    <Icon className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  )}
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
