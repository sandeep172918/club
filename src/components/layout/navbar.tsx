
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
import { Trophy } from "lucide-react";

export default function Navbar() {
  const { user, signout } = useAuth();

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

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          C3
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
            <div className="flex items-center gap-1.5 rounded-full bg-accent/50 px-3 py-1 text-sm font-medium border border-border">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>{user.points || 0} Pts</span>
            </div>
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
