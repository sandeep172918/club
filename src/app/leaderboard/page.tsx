

"use client";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import { useEffect, useState } from "react";
import { LeaderboardEntry, Student } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { user } = useAuth();

  const fetchLeaderboard = async () => {
    const res = await fetch("/api/leaderboard");
    const { data } = await res.json();
    setLeaderboard(data);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <main className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl">
            Leaderboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            See where you and your peers stand.
          </p>
        </div>
      </div>
      <LeaderboardTable leaderboard={leaderboard} />
    </main>
  );
}

export default LeaderboardPage;


