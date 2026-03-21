import { ArrowRight, Briefcase, FileText, Share2 } from "lucide-react";
import type { ContentReference } from "@/types/chat";

const TYPE_ICON = {
	blog: FileText,
	project: Briefcase,
	share: Share2,
} as const;

export function ContentReferenceCard({ reference }: { reference: ContentReference }) {
	const Icon = TYPE_ICON[reference.type];

	return (
		<a
			href={reference.href}
			target="_blank"
			rel="noopener noreferrer"
			className="group flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-slate-800/60 px-3 py-2 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10"
		>
			<div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700/50">
				{reference.image ? (
					<img
						src={reference.image}
						alt={reference.title}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<Icon className="h-4 w-4 text-emerald-500/60" />
					</div>
				)}
			</div>

			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">
					{reference.title}
				</p>
				{reference.description && (
					<p className="line-clamp-1 text-xs text-slate-400">
						{reference.description}
					</p>
				)}
			</div>

			<ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-400" />
		</a>
	);
}
