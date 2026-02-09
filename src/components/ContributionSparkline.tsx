import type { DailyContribution } from '@/types/github';

interface ContributionSparklineProps {
  data: DailyContribution[];
  className?: string;
}

export function ContributionSparkline({ data, className = '' }: ContributionSparklineProps) {
  const last7 = data.slice(-7);
  if (last7.length === 0) return null;

  const maxCount = Math.max(...last7.map((d) => d.count), 1);
  const midCount = Math.round(maxCount / 2);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between items-end h-28 text-[10px] text-muted-foreground/50 shrink-0 py-0.5">
          <span>{maxCount}</span>
          <span>{midCount}</span>
          <span>0</span>
        </div>
        <div className="flex items-end gap-2 h-28 flex-1">
          {last7.map((day) => {
            const heightPercent = day.count > 0
              ? Math.max((day.count / maxCount) * 100, 8)
              : 4;

            return (
              <div
                key={day.date}
                className={`flex-1 rounded-sm transition-colors ${
                  day.count > 0
                    ? 'bg-emerald-500/70 hover:bg-emerald-400'
                    : 'bg-emerald-500/20'
                }`}
                style={{ height: `${heightPercent}%` }}
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
