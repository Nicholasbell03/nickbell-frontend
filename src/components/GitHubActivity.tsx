import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useGitHubActivity } from '@/hooks/useQueries';
import { ContributionSparkline } from '@/components/ContributionSparkline';

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center space-y-1">
      <div className="text-2xl font-bold text-emerald-400">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function GitHubActivity() {
  const { data, isLoading } = useGitHubActivity();
  const activity = data?.data;

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </section>
    );
  }

  if (!activity || activity.daily_contributions.length === 0) {
    return null;
  }

  const { stats } = activity;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-2 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">GitHub Activity</h2>
          <p className="text-muted-foreground text-lg">
            Contribution activity over the last 30 days
          </p>
        </div>

        <Card className="border-emerald-500/20">
          <CardContent className="pt-6 space-y-6">
            <ContributionSparkline data={activity.daily_contributions} />

            <div className="grid grid-cols-3 gap-4">
              <StatItem
                label="Last 7 Days"
                value={stats.total_last_7_days.toLocaleString()}
              />
              <StatItem
                label="Last 30 Days"
                value={stats.total_last_30_days.toLocaleString()}
              />
              <StatItem
                label="Streak"
                value={`${stats.current_streak}d`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
