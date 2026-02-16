import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, FileText, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useFeaturedBlogs } from "@/hooks/useQueries";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

export function BlogPreview() {
	const [fadeInRef, fadeInClass] = useFadeInOnScroll();
	const { data, isLoading } = useFeaturedBlogs();
	const posts = data?.data ?? [];

	if (isLoading) {
		return (
			<section className="py-16 md:py-24 px-4 bg-background/50">
				<div className="container mx-auto max-w-7xl flex justify-center items-center min-h-[300px]">
					<Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
				</div>
			</section>
		);
	}

	if (posts.length === 0) {
		return null;
	}

	return (
		<section className="py-16 md:py-24 px-4 bg-background/50">
			<div
				ref={fadeInRef}
				className={`container mx-auto max-w-7xl ${fadeInClass}`}
			>
				<div className="flex items-center justify-between mb-12">
					<div className="space-y-2">
						<h2 className="text-3xl md:text-4xl font-bold">
							Latest Blogs
						</h2>
						<p className="text-muted-foreground text-lg">
							Insights on web development, AI integration, and
							software architecture
						</p>
					</div>
					<Link to="/blog">
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
					{posts.map((post, index) => (
						<Link key={post.id} to={`/blog/${post.slug}`}>
							<Card
								className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-500/20 flex flex-col h-full cursor-pointer overflow-hidden"
								style={{
									animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
								}}
							>
								<div className="relative h-40 overflow-hidden bg-muted">
									{post.featured_image ? (
										<img
											src={post.featured_image}
											alt={post.title}
											loading="lazy"
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center">
											<FileText className="h-14 w-14 text-emerald-800" />
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
								</div>
								<CardHeader>
									<div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{formatDistanceToNow(
												new Date(post.published_at),
												{ addSuffix: true },
											)}
										</div>
										<div className="flex items-center gap-1">
											<Clock className="h-4 w-4" />
											{post.read_time} min
										</div>
									</div>
									<CardTitle className="group-hover:text-emerald-400 transition-colors">
										{post.title}
									</CardTitle>
									<CardDescription className="line-clamp-3">
										{post.excerpt}
									</CardDescription>
								</CardHeader>
								<CardContent className="mt-auto">
									<div className="text-sm text-emerald-400 group-hover:text-emerald-300 flex items-center gap-2">
										Read More
										<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

				<div className="text-center sm:hidden">
					<Link to="/blog">
						<Button variant="outline" className="group">
							View All Posts
							<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
