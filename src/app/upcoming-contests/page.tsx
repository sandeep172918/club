
"use client";
import UpcomingContestsCard from "@/components/dashboard/upcoming-contests-card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ClubContest } from "@/types";
import AddClubContestDialog from "@/components/upcoming-contests/add-club-contest-dialog";
import { useSocket } from "@/context/SocketContext";

function UpcomingContestsPage() {
  const { user } = useAuth();
  const [contests, setContests] = useState<ClubContest[]>([]);
  const { socket } = useSocket();

  const fetchContests = async () => {
    const res = await fetch("/api/club-contests");
    const { data } = await res.json();
    setContests(data);
  };

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
        if (data.type === 'CONTEST_ADDED') {
            fetchContests();
        }
    };
    socket.on("data_update", handleUpdate);
    return () => {
        socket.off("data_update", handleUpdate);
    };
  }, [socket]);

  const handleAddContest = async (contestData: {
    name: string;
    link: string;
    date: string;
    time: string;
  }) => {
    await fetch("/api/club-contests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contestData),
    });
    fetchContests(); // Refresh the list
  };

  return (
    <main className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl">
            Upcoming Club Contests
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Contests organized by your club.
          </p>
        </div>
        {user?.role === "admin" && (
          <AddClubContestDialog onAddContest={handleAddContest} />
        )}
      </div>
      <UpcomingContestsCard contests={contests} />
    </main>
  );
}

export default UpcomingContestsPage;
