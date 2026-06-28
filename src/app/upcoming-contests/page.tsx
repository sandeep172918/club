
"use client";
import UpcomingContestsCard from "@/components/dashboard/upcoming-contests-card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ClubContest } from "@/types";
import AddClubContestDialog from "@/components/upcoming-contests/add-club-contest-dialog";
import { useSocket } from "@/context/SocketContext";
import DecryptedText from "@/components/ui/decrypted-text";

function UpcomingContestsPage() {
  const { user } = useAuth();
  const [contests, setContests] = useState<ClubContest[]>([]);
  const { socket } = useSocket();

  const fetchContests = async () => {
    const clubId = typeof user?.clubId === 'object' && user?.clubId ? (user.clubId as any)._id : (user?.clubId || "all");
    const res = await fetch(`/api/club-contests?clubId=${clubId}`);
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

  // 30-second polling fallback auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchContests();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

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
      body: JSON.stringify({
        ...contestData,
        clubId: typeof user?.clubId === 'object' && user?.clubId ? (user.clubId as any)._id : user?.clubId,
      }),
    });
    fetchContests(); // Refresh the list
  };

  return (
    <main className="p-4 md:p-8">
      {user?.role === "student" && (
        <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-center gap-3">
          <span className="text-amber-400 text-sm">⚠️</span>
          <p className="text-xs text-[#B5B5B5] font-medium leading-relaxed">
            If you want all access, you will need membership. Please request it on your <a href="/profile" className="text-amber-400 hover:underline font-bold">Profile Page</a>.
          </p>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div className="min-w-0 flex-1">
          <DecryptedText
            text="Upcoming Club Contests"
            animateOn="view"
            speed={100}
            className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Contests organized by your club.
          </p>
        </div>
        {(user?.role === "super_admin" || user?.role === "coordinator") && (
          <AddClubContestDialog onAddContest={handleAddContest} />
        )}
      </div>
      <UpcomingContestsCard contests={contests} />
    </main>
  );
}

export default UpcomingContestsPage;
