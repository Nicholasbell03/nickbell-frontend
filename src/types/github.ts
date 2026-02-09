export interface DailyContribution {
  date: string;
  count: number;
}

export interface GitHubStats {
  total_last_30_days: number;
  total_last_90_days: number;
  current_streak: number;
  longest_streak: number;
  average_per_day: number;
}

export interface GitHubActivity {
  daily_contributions: DailyContribution[];
  stats: GitHubStats;
}
