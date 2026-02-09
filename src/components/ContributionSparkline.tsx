import type { DailyContribution } from '@/types/github';

interface ContributionSparklineProps {
  data: DailyContribution[];
  className?: string;
}

export function ContributionSparkline({ data, className = '' }: ContributionSparklineProps) {
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barWidth = 1;
  const gap = 0.3;
  const totalWidth = data.length * (barWidth + gap) - gap;
  const height = 40;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      preserveAspectRatio="none"
      className={`w-full h-16 ${className}`}
      role="img"
      aria-label="GitHub contribution activity sparkline"
    >
      {data.map((day, i) => {
        const barHeight = day.count > 0
          ? Math.max((day.count / maxCount) * height, 1)
          : 1;

        return (
          <rect
            key={day.date}
            x={i * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            className={day.count > 0
              ? 'fill-emerald-500/70 hover:fill-emerald-400 transition-colors'
              : 'fill-emerald-500/20'
            }
          >
            <title>{`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}
