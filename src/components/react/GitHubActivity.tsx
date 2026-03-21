/**
 * GitHubActivity React island — kept as React for IntersectionObserver
 * animation logic (staggered sparkline + stats reveal).
 * Receives data as props from the Astro page (fetched server-side).
 * Mounted with client:visible so it only hydrates when scrolled into view.
 */
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ContributionSparkline, TOTAL_BAR_ANIMATION_MS } from '@/components/ContributionSparkline';
import type { GitHubActivity as GitHubActivityType } from '@/types/github';

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5 text-center">
      <div className="text-2xl font-bold text-emerald-400">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

interface Props {
  activity: GitHubActivityType;
}

export default function GitHubActivity({ activity }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => setShowStats(true), TOTAL_BAR_ANIMATION_MS + 300);
    return () => clearTimeout(timeout);
  }, [isVisible]);

  const { stats } = activity;

  return (
    <a
      href="https://github.com/Nicholasbell03"
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="border-emerald-500/20 h-full transition-colors hover:border-emerald-500/40">
        <CardContent ref={ref} className="p-6 h-full flex flex-col">
          <h2 className="text-3xl md:text-4xl font-bold">GitHub Activity</h2>
          <div className="flex-1" />
          <div className="space-y-6">
            <ContributionSparkline data={activity.daily_contributions} animate={isVisible} />
            <div
              className={`grid grid-cols-3 items-center gap-4 transition-opacity duration-500 ${
                showStats ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <StatItem label="7 Days" value={stats.total_last_7_days.toLocaleString()} />
              <StatItem label="30 Days" value={stats.total_last_30_days.toLocaleString()} />
              <StatItem label="Streak" value={`${stats.current_streak}d`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
