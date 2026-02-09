import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useGitHubActivity } from "@/hooks/useQueries";
import { ContributionSparkline } from "@/components/ContributionSparkline";

function StatItem({ label, value }: { label: string; value: string }) {
	return (
		<div className="space-y-0.5 text-center">
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
			<Card className="border-emerald-500/20 h-full">
				<CardContent className="flex justify-center items-center min-h-[200px] pt-6">
					<Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
				</CardContent>
			</Card>
		);
	}

	if (!activity || activity.daily_contributions.length === 0) {
		return null;
	}

	const { stats } = activity;

	return (
		<a
			href="https://github.com/Nicholasbell03"
			target="_blank"
			rel="noopener noreferrer"
			className="block"
		>
			<Card className="border-emerald-500/20 h-full transition-colors hover:border-emerald-500/40">
				<CardContent className="p-6 h-full flex flex-col">
					<h2 className="text-3xl md:text-4xl font-bold">
						GitHub Activity
					</h2>
					<div className="flex-1" />
					<div className="space-y-6">
					<ContributionSparkline
						data={activity.daily_contributions}
					/>
					<div className="grid grid-cols-3 items-center gap-4">
						<StatItem
							label="7 Days"
							value={stats.total_last_7_days.toLocaleString()}
						/>
						<StatItem
							label="30 Days"
							value={stats.total_last_30_days.toLocaleString()}
						/>
						<StatItem
							label="Streak"
							value={`${stats.current_streak}d`}
						/>
					</div>
					</div>
				</CardContent>
			</Card>
		</a>
	);
}
