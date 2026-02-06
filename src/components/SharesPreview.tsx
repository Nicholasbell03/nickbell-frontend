import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Loader2 } from "lucide-react";
import { FaYoutube, FaXTwitter } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";
import { useFeaturedShares } from "@/hooks/useQueries";
import type { SourceType } from "@/types/share";
import { safeHostname } from "@/lib/utils";

function SourceIcon({
	type,
	className,
}: {
	type: SourceType;
	className?: string;
}) {
	switch (type) {
		case "youtube":
			return <FaYoutube className={className} />;
		case "x_post":
			return <FaXTwitter className={className} />;
		default:
			return <Globe className={className} />;
	}
}

export function SharesPreview() {
	const { data, isLoading } = useFeaturedShares();
	const shares = data?.data ?? [];

	if (isLoading) {
		return (
			<section className="py-16 md:py-24 px-4">
				<div className="container mx-auto max-w-7xl flex justify-center items-center min-h-[300px]">
					<Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
				</div>
			</section>
		);
	}

	if (shares.length === 0) {
		return null;
	}

	return (
		<section className="py-16 md:py-24 px-4">
			<div className="container mx-auto max-w-7xl">
				<div className="flex items-center justify-between mb-12">
					<div className="space-y-2">
						<h2 className="text-3xl md:text-4xl font-bold">
							Latest Shares
						</h2>
						<p className="text-muted-foreground text-lg">
							Interesting finds from around the web
						</p>
					</div>
					<Link to="/shares">
						<Button
							variant="outline"
							className="group hidden sm:flex"
						>
							View All
							<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Button>
					</Link>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{shares.map((share, index) => (
						<Link key={share.id} to={`/shares/${share.slug}`}>
							<Card
								className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-500/20 overflow-hidden h-full cursor-pointer"
								style={{
									animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
								}}
							>
								<div className="relative h-40 overflow-hidden bg-muted">
									{share.image_url ? (
										<img
											src={share.image_url}
											alt={share.title ?? ""}
											loading="lazy"
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center">
											<SourceIcon
												type={share.source_type}
												className="h-14 w-14 text-emerald-800"
											/>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
								</div>
								<CardHeader>
									<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
										<SourceIcon
											type={share.source_type}
											className="h-4 w-4 text-emerald-400"
										/>
										{share.site_name && (
											<span>{share.site_name}</span>
										)}
										<span className="ml-auto">
											{formatDistanceToNow(
												new Date(share.created_at),
												{ addSuffix: true },
											)}
										</span>
									</div>
									<CardTitle className="text-lg group-hover:text-emerald-400 transition-colors">
										{share.title ?? safeHostname(share.url)}
									</CardTitle>
									{share.description && (
										<CardDescription className="line-clamp-2">
											{share.description}
										</CardDescription>
									)}
								</CardHeader>
								<CardContent className="mt-auto">
									<div className="text-sm text-emerald-400 group-hover:text-emerald-300 flex items-center gap-2">
										View Share
										<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

				<div className="text-center sm:hidden">
					<Link to="/shares">
						<Button variant="outline" className="group">
							View All Shares
							<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
