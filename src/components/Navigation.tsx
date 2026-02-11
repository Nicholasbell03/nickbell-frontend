import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { Contact } from "./Contact";
import { SearchBar } from "./SearchBar";

export function Navigation() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const location = useLocation();

	const isActive = (path: string) => {
		if (path === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(path);
	};

	const navItems = [
		{ name: "Home", path: "/" },
		{ name: "Projects", path: "/projects" },
		{ name: "Blog", path: "/blog" },
		{ name: "Shares", path: "/shares" },
	];

	return (
		<nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-emerald-500/20">
			<div className="container mx-auto max-w-7xl px-4">
				<div className="flex items-center justify-between h-16">
					<Link to="/" className="flex items-center gap-2 group">
						<Code2 className="h-6 w-6 text-emerald-400 group-hover:rotate-180 transition-transform duration-300" />
						<span className="font-bold text-lg">Nick</span>
					</Link>

					<div className="hidden md:flex items-center gap-1">
						{navItems.map((item) => (
							<Link key={item.path} to={item.path}>
								<Button
									variant="ghost"
									className={`${
										isActive(item.path)
											? "text-emerald-400 bg-emerald-500/10"
											: "hover:text-emerald-400 hover:bg-emerald-500/5"
									}`}
								>
									{item.name}
								</Button>
							</Link>
						))}
						<SearchBar />
						<Contact />
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className="md:hidden border-t border-emerald-500/20 bg-background/98">
					<div className="container mx-auto max-w-7xl px-4 py-4 space-y-2">
						<SearchBar mobile onNavigate={() => setMobileMenuOpen(false)} />
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setMobileMenuOpen(false)}
							>
								<Button
									variant="ghost"
									className={`w-full justify-start ${
										isActive(item.path)
											? "text-emerald-400 bg-emerald-500/10"
											: "hover:text-emerald-400 hover:bg-emerald-500/5"
									}`}
								>
									{item.name}
								</Button>
							</Link>
						))}
						<div className="pt-2">
							<Contact />
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
