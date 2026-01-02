import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, Menu, X, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Series", href: "/series" }, // Placeholder routes
    { name: "Films", href: "/films" },
    { name: "New & Popular", href: "/new" },
    { name: "My List", href: "/my-list" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-colors duration-300 ease-in-out px-4 md:px-12 py-4",
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="cursor-pointer">
            <h1 className="text-3xl md:text-4xl font-display text-primary tracking-wide text-shadow">NETFLIX</h1>
          </Link>

          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-white/80",
                  location === link.href ? "text-white font-bold" : "text-white/70"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-white">
          <Link href="/search" className="hover:text-gray-300 transition">
            <Search className="w-5 h-5" />
          </Link>
          
          <div className="hidden md:block">
            <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center overflow-hidden border border-transparent group-hover:border-white transition-all">
                   {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-black/90 border-zinc-800 text-white">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-semibold text-zinc-400">
                    {user.firstName ? `Hi, ${user.firstName}` : user.email || 'Hello!'}
                  </div>
                  <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">Account</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">Help Center</DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="focus:bg-zinc-800 cursor-pointer text-red-500 focus:text-red-400 border-t border-zinc-800 mt-1"
                  >
                    Sign out of Netflix
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer" onClick={() => window.location.href = "/api/login"}>
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 border-t border-zinc-800 flex flex-col p-4 gap-4 md:hidden animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-base font-medium py-2 border-b border-zinc-800",
                location === link.href ? "text-white" : "text-zinc-400"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
