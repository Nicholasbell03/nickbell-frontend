import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, ChevronDown } from "lucide-react";

const CONTACT_INFO = {
	linkedin: "https://linkedin.com/in/nicholas-j-bell",
	email: "nicholasbell03@gmail.com",
};

export function Contact() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="bg-emerald-500 hover:bg-emerald-600 text-white ml-2">
					Contact Me
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem asChild>
					<a
						href={CONTACT_INFO.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 cursor-pointer"
					>
						<Linkedin className="h-4 w-4 text-emerald-400" />
						<span>LinkedIn</span>
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<a
						href={`mailto:${CONTACT_INFO.email}`}
						className="flex items-center gap-2 cursor-pointer"
					>
						<Mail className="h-4 w-4 text-emerald-400" />
						<span>Email</span>
					</a>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
