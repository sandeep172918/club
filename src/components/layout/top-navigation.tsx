"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  ChevronDown, 
  LogOut, 
  Menu,
  X,
  Code,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function TopNavigation() {
  const { user, signout, refreshUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [time, setTime] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!user?._id) return;
    setIsSyncing(true);
    try {
        const res = await fetch(`/api/students/${user._id}/update-participation?force=true`, { method: "POST" });
        if (res.ok) {
            await refreshUser();
            toast({
                title: "Synced",
                description: "Your Codeforces data has been updated.",
            });
            setTimeout(() => {
                window.location.reload();
            }, 800);
        } else {
             toast({
                title: "Sync Failed",
                description: "Could not sync data. Try again later.",
                variant: "destructive"
            });
        }
    } catch (error) {
        console.error("Sync error", error);
         toast({
            title: "Error",
            description: "Something went wrong.",
            variant: "destructive"
        });
    } finally {
        setIsSyncing(false);
    }
  };

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const formattedTime = time ? format(time, "hh:mm:ss a") : "";
  const formattedDate = time ? format(time, "EEE, MMM dd, yyyy") : "";

  const getClubDisplayName = () => {
    if (user.role === 'super_admin') {
      return 'Super Admin';
    }
    if (typeof user.clubId === 'object' && user.clubId) {
      return (user.clubId as any).name;
    }
    return 'Unassigned';
  };

  const isAdminOrCoordinator = user.role === "super_admin" || user.role === "coordinator";
  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/potd", label: "POTD" },
    { href: "/attendance", label: "Attendance" },
    { href: "/upcoming-contests", label: "Contests" },
    ...(isAdminOrCoordinator ? [{ href: "/students", label: "Members" }] : []),
    { href: "/profile", label: "Profile" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0B0B]/85 backdrop-blur-md pt-2">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
        
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 font-bold tracking-tight text-white group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-[#7EE787]/30 transition-colors">
              <Code className="h-5 w-5 text-[#7EE787]" />
            </div>
            <span className="text-[19px] font-bold tracking-tight">CP.cpp</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "text-[#7EE787] font-semibold"
                      : "text-[#B5B5B5] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Live Updating Clock */}
        <div className="hidden flex-col items-center justify-center text-center md:flex">
          <span className="font-mono text-[18px] font-bold tracking-wider text-white">
            {formattedTime || "00:00:00 AM"}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7A7A] mt-0.5">
            {formattedDate}
          </span>
        </div>

        {/* Right Side: Club Name, User Info, Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden text-[11px] font-semibold text-[#7EE787] bg-[#7EE787]/10 border border-[#7EE787]/20 px-3 py-1 rounded-full lg:inline-block">
            {getClubDisplayName()}
          </span>

          <div className="h-4 w-[1px] bg-white/10 hidden lg:block" />

          {/* Points display */}
          <div className="hidden items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1 text-xs font-semibold text-[#7EE787] sm:flex">
            <span>{user.points || 0} PTS</span>
          </div>

          {/* Sync Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSync}
            disabled={isSyncing}
            className="text-[#7A7A7A] hover:text-white hover:bg-white/5 h-8 w-8 rounded-lg"
            title="Sync Codeforces Data"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>

          {/* User Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-all hover:bg-white/5 focus:outline-none">
                <Avatar className="h-7 w-7 border border-white/10">
                  <AvatarImage src={`https://github.com/${user.codeforcesHandle}.png`} />
                  <AvatarFallback className="bg-white/5 text-xs text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-[13px] font-medium text-[#B5B5B5] hover:text-white sm:block">
                  {user.name}
                </span>
                <ChevronDown className="h-3 w-3 text-[#7A7A7A] hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-white/5 bg-[#161616] text-white">
              <DropdownMenuItem onClick={signout} className="focus:bg-white/5 focus:text-red-400 text-red-500 cursor-pointer gap-2">
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-[#B5B5B5] hover:bg-white/5 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/5 bg-[#0B0B0B] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-[14px] font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-white/5 text-white"
                    : "text-[#B5B5B5] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-white/5" />
            <div className="flex justify-between items-center py-2">
              <span className="text-[12px] font-medium uppercase tracking-widest text-[#7A7A7A]">
                Local Time
              </span>
              <span className="font-mono text-[14px] font-semibold text-white">
                {formattedTime || "00:00:00 AM"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[12px] font-medium uppercase tracking-widest text-[#7A7A7A]">
                Date
              </span>
              <span className="text-[13px] font-medium text-white">
                {formattedDate}
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
