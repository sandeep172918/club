

"use client";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import { useEffect, useState } from "react";
import { LeaderboardEntry, Student } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const { user } = useAuth();
  const { socket } = useSocket();

  const fetchLeaderboard = async () => {
    const res = await fetch(`/api/leaderboard?year=${selectedYear}`);
    const { data } = await res.json();
    setLeaderboard(data);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedYear]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
        // Leaderboard depends on students (points, ratings)
        if (['STUDENT_UPDATED', 'LEADERBOARD_UPDATED', 'PROBLEM_ADDED', 'POTD_UPDATED'].includes(data.type)) {
            fetchLeaderboard();
        }
    };
    socket.on("data_update", handleUpdate);
    return () => {
        socket.off("data_update", handleUpdate);
    };
  }, [socket, selectedYear]);

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
        <div className="w-[180px]">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Years</SelectItem>
              <SelectItem value="22">2022</SelectItem>
              <SelectItem value="23">2023</SelectItem>
              <SelectItem value="24">2024</SelectItem>
              <SelectItem value="25">2025</SelectItem>
              <SelectItem value="26">2026</SelectItem>
              <SelectItem value="27">2027</SelectItem>
              <SelectItem value="28">2028</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <LeaderboardTable leaderboard={leaderboard} />
    </main>
  );
}

export default LeaderboardPage;


