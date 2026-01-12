
"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Trophy, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/context/SocketContext";
import { NotificationPopover } from "@/components/layout/notification-popover";

export default function Navbar() {
  const { user, signout, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const { socket } = useSocket();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/attendance", label: "Attendance" },
    { href: "/potd", label: "POTD" },
    { href: "/upcoming-contests", label: "Upcoming Contests" },
    { href: "/resources", label: "Resources" },
    user?.role === "admin"
      ? { href: "/students", label: "Students" }
      : { href: "/profile", label: "Profile" },
  ];

  const handleSync = async () => {
    if (!user?._id) return;
    setIsSyncing(true);
    try {
        const res = await fetch(`/api/students/${user._id}/update-participation`, { method: "POST" });
        if (res.ok) {
            await refreshUser();
            // Removed socket emit to keep sync private/individual
            toast({
                title: "Synced",
                description: "Your Codeforces data has been updated.",
            });
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

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          CP.cpp
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        {user && (
            <>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSync} 
                    disabled={isSyncing}
                    title="Sync Codeforces Data"
                >
                    {isSyncing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    )}
                </Button>
                <div className="flex items-center gap-1.5 rounded-full bg-accent/50 px-3 py-1 text-sm font-medium border border-border">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>{user.points || 0} Pts</span>
                </div>
                <NotificationPopover />
            </>
        )}
        <ThemeSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://github.com/${user?.codeforcesHandle}.png`} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={signout}>Sign out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
