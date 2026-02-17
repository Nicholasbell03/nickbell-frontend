import { Globe } from "lucide-react";
import { FaYoutube, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import type { SourceType } from "@/types/share";

export function SourceIcon({
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
		case "linkedin":
			return <FaLinkedin className={className} />;
		default:
			return <Globe className={className} />;
	}
}
