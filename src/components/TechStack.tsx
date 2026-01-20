import { Badge } from '@/components/ui/badge';
import {
  Code2,
  Database,
  Container,
  Boxes,
  Layers,
  Cpu,
  Cloud,
  GitBranch,
} from 'lucide-react';

// TODO: Fetch from Skills/Technologies API
const techStack = [
  { name: 'Laravel', icon: Code2 },
  { name: 'React', icon: Layers },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Supabase', icon: Database },
  { name: 'PostgreSQL', icon: Database },
  { name: 'Docker', icon: Container },
  { name: 'Redis', icon: Boxes },
  { name: 'TailwindCSS', icon: Layers },
  { name: 'Node.js', icon: Cpu },
  { name: 'AWS', icon: Cloud },
  { name: 'Git', icon: GitBranch },
  { name: 'REST APIs', icon: Code2 },
];

export function TechStack() {
  return (
    <section className="py-16 md:py-24 px-4 bg-background/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Tech Stack</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Building with modern technologies and best practices
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
