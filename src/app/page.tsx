"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { WeeklySummary } from "@/components/dashboard/weekly-summary";
import { Heatmap } from "@/components/dashboard/heatmap";
import { TopPerformers } from "@/components/dashboard/top-performers";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ActivityCharts } from "@/components/dashboard/activity-charts";
import { DifficultyBreakdown } from "@/components/dashboard/difficulty-breakdown";
import { UpcomingContests } from "@/components/dashboard/upcoming-contests";
import DecryptedText from "@/components/ui/decrypted-text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardData {
  totalStudents: number;
  problemsSolvedThisWeek: number;
  problemsSolvedLastWeek: number;
  averageRating: number;
  topPerformers: any[];
  skillDistribution: {
    beginner: number;
    pupil: number;
    specialist: number;
    expert: number;
    master: number;
  };
  progressSnapshot: {
    improved: number;
    same: number;
    dropped: number;
  };
  ratingDistribution: { range: string; count: number }[];
  difficultyBreakdown: { difficulty: string; count: number }[];
  recentActivities: any[];
  heatmapData: { date: string; count: number }[];
  upcomingContests: any[];
  clubContests: any[];
}

export default function HomePage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [data, setData] = useState<DashboardData | null>(null);
  const [ratingHistory, setRatingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clubs, setClubs] = useState<any[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>("all");

  useEffect(() => {
    if (user) {
      if (user.role === "super_admin") {
        fetch("/api/clubs")
          .then(res => res.json())
          .then(json => {
            if (json.success) setClubs(json.data);
          });
      } else {
        const cId = typeof user.clubId === 'object' && user.clubId ? (user.clubId as any)._id : user.clubId;
        setSelectedClubId(cId || "all");
      }
    }
  }, [user]);

  const fetchMetrics = useCallback(async () => {
    try {
      const metricsUrl = `/api/dashboard-extended-metrics?clubId=${selectedClubId}`;
      const historyUrl = `/api/club-rating-history?clubId=${selectedClubId}`;

      const [metricsRes, historyRes] = await Promise.all([
        fetch(metricsUrl),
        fetch(historyUrl),
      ]);

      if (!metricsRes.ok || !historyRes.ok) {
        throw new Error("Failed to fetch dashboard metrics");
      }

      const metricsJson = await metricsRes.json();
      const historyJson = await historyRes.json();

      if (metricsJson.success) {
        setData(metricsJson.data);
      } else {
        throw new Error(metricsJson.error || "Failed to load metrics");
      }

      if (historyJson.success) {
        setRatingHistory(historyJson.data);
      }
    } catch (e: any) {
      console.error("Dashboard fetch error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedClubId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (update: any) => {
      if (['STUDENT_UPDATED', 'PROBLEM_ADDED', 'POTD_UPDATED', 'CONTEST_ADDED', 'STUDENT_DELETED', 'STUDENT_ADDED'].includes(update.type)) {
        fetchMetrics();
      }
    };
    socket.on("data_update", handleUpdate);
    return () => {
      socket.off("data_update", handleUpdate);
    };
  }, [socket, fetchMetrics]);

  // 30-second polling fallback auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div className="flex flex-col gap-10 animate-pulse">
        {/* Hero skeleton */}
        <div className="space-y-4 mt-4">
          <div className="h-10 w-64 rounded bg-white/5" />
          <div className="h-4 w-32 rounded bg-white/5" />
          <div className="h-4 w-96 rounded bg-white/5" />
        </div>
        
        {/* KPI skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-[160px] rounded-[20px] bg-[#161616] border border-white/5 col-span-1 md:col-span-2 xl:col-span-2" />
          <div className="h-[160px] rounded-[20px] bg-[#161616] border border-white/5" />
          <div className="h-[160px] rounded-[20px] bg-[#161616] border border-white/5" />
        </div>

        {/* Heatmap skeleton */}
        <div className="h-[190px] rounded-[20px] bg-[#161616] border border-white/5 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold text-[#F85149]">Failed to load dashboard metrics</p>
        <p className="text-xs text-[#7A7A7A] mt-1">{error}</p>
        <button 
          onClick={() => { setLoading(true); fetchMetrics(); }} 
          className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white hover:bg-white/10"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Resolve greeting based on hour of day
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Sandeep";

  return (
    <div className="flex flex-col gap-10">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-white leading-none">
              {getGreeting()},
            </h1>
            <DecryptedText
              text={firstName}
              animateOn="view"
              speed={80}
              className="text-[34px] sm:text-[42px] font-bold tracking-tight text-[#7EE787] leading-none"
            />
          </div>
          <p className="text-[12px] font-semibold text-[#7A7A7A] uppercase tracking-widest">
            {user?.role === "super_admin" ? "SaaS Platform Management" : "CP Club Dashboard"}
          </p>
          <p className="text-[14px] text-[#B5B5B5] max-w-xl">
            {user?.role === "super_admin" 
              ? "Comprehensive platform-wide view of competitive programming analytics."
              : `Weekly overview of club performance and competitive programming analytics.`}
          </p>
        </div>

        {user?.role === "super_admin" && (
          <div className="w-[240px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A7A7A] block mb-2">View Analytics for</span>
            <Select value={selectedClubId} onValueChange={setSelectedClubId}>
              <SelectTrigger className="bg-[#161616] border-white/5 text-white">
                <SelectValue placeholder="All Clubs" />
              </SelectTrigger>
              <SelectContent className="bg-[#161616] border-white/5 text-white">
                <SelectItem value="all">🌐 All Clubs (Combined)</SelectItem>
                {clubs.map((c) => (
                  <SelectItem key={c._id} value={c._id!}>
                    {c.logo || "🚀"} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Row 1: KPI Stats */}
      <WeeklySummary
        totalStudents={data.totalStudents}
        problemsSolvedThisWeek={data.problemsSolvedThisWeek}
        problemsSolvedLastWeek={data.problemsSolvedLastWeek}
        averageRating={data.averageRating}
        progressSnapshot={data.progressSnapshot}
        upcomingContestsCount={data.upcomingContests.length + data.clubContests.length}
      />

      {/* Row 2: Heatmap */}
      <Heatmap data={data.heatmapData} />

      {/* Row 3: Leaderboard & Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TopPerformers performers={data.topPerformers} />
        <RecentActivity activities={data.recentActivities} />
      </div>

      {/* Row 4: Recharts Rating Trend & Rating Tier Distribution */}
      <ActivityCharts
        ratingDistribution={data.ratingDistribution}
        difficultyBreakdown={data.difficultyBreakdown}
        averageRatingHistory={ratingHistory}
      />

      {/* Row 5: Skill battery & Problem Difficulty solved */}
      <DifficultyBreakdown
        skillDistribution={data.skillDistribution}
        difficultyBreakdown={data.difficultyBreakdown}
        totalStudents={data.totalStudents}
      />

      {/* Row 6: Scheduled and External Contests */}
      <UpcomingContests
        externalContests={data.upcomingContests}
        clubContests={data.clubContests}
      />

    </div>
  );
}
