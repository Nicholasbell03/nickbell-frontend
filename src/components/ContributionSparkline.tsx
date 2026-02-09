import type { DailyContribution } from '@/types/github';

interface ContributionSparklineProps {
  data: DailyContribution[];
  animate?: boolean;
  className?: string;
}

const BAR_DELAY_MS = 120;

export const TOTAL_BAR_ANIMATION_MS = 7 * BAR_DELAY_MS;

export function ContributionSparkline({ data, animate = false, className = '' }: ContributionSparklineProps) {
  const last7 = data.slice(-7);
  if (last7.length === 0) return null;

  const rawMax = Math.max(...last7.map((d) => d.count));
  const allZero = rawMax === 0;
  const maxCount = allZero ? 0 : rawMax;
  const midCount = allZero ? 0 : Math.round(maxCount / 2);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between items-end h-28 text-[10px] text-muted-foreground/50 shrink-0 py-0.5">
          <span>{maxCount}</span>
          <span>{midCount}</span>
          <span>0</span>
        </div>
        <div className="flex items-end gap-2 h-28 flex-1">
          {last7.map((day, index) => {
            const heightPercent = allZero
              ? 4
              : day.count > 0
                ? Math.max((day.count / maxCount) * 100, 8)
                : 4;

            return (
              <div
                key={day.date}
                className={`flex-1 rounded-sm ${
                  day.count > 0
                    ? 'bg-emerald-500/70 hover:bg-emerald-400'
                    : 'bg-emerald-500/20'
                } transition-all duration-500 ease-out`}
                style={{
                  height: animate ? `${heightPercent}%` : '0%',
                  transitionDelay: `${index * BAR_DELAY_MS}ms`,
                }}
                title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
              />
            );
          })}
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>7 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
