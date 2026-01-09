

"use client";
import { StatCard } from "@/components/dashboard/stat-card";
// Removed unused imports: UpcomingContestsCard
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
// Removed unused imports: Contest, Student
import { Users, TrendingUp, CalendarCheck, Code } from "lucide-react"; // Re-added TrendingUp, CalendarCheck

// New Dashboard Components
import SkillDistribution from "@/components/dashboard/skill-distribution";
import ProgressSnapshot from "@/components/dashboard/progress-snapshot";
import EngagementMetrics from "@/components/dashboard/engagement-metrics";
import { useSocket } from "@/context/SocketContext";

interface DashboardMetrics {
  totalStudents: number;
  problemsSolvedThisWeek: number;
  problemsSolvedLastWeek: number;
  skillDistribution: {
    beginner: { count: number; percentage: number };
    intermediate: { count: number; percentage: number };
    advanced: { count: number; percentage: number };
  };
  progressSnapshot: {
    improved: number;
    same: number;
    dropped: number;
    total: number;
  };
  engagement: {
    lastContestAttendance: { count: number; total: number; percentage: number };
    activeMembersThisMonth: { count: number; total: number; percentage: number };
  };
}

function HomePage() {
  const { user } = useAuth();
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  const fetchDashboardMetrics = useCallback(async () => {
    // Keep loading state mostly for initial load, or handle background refresh quietly
    // setLoading(true); // Don't reset loading on socket updates to avoid flickering
    try {
      const res = await fetch("/api/dashboard-metrics");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const { data } = await res.json();
      setDashboardMetrics(data);
    } catch (e: any) {
      console.error("Fetch metrics error:", e);
      // setError(e.message); // Don't show error on background refresh
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
        if (['STUDENT_UPDATED', 'PROBLEM_ADDED', 'POTD_UPDATED', 'CONTEST_ADDED'].includes(data.type)) {
            fetchDashboardMetrics();
        }
    };
    socket.on("data_update", handleUpdate);
    return () => {
        socket.off("data_update", handleUpdate);
    };
  }, [socket, fetchDashboardMetrics]);

  if (loading) {
    return <p className="p-4 md:p-8">Loading dashboard metrics...</p>;
  }

  if (error) {
    return <p className="p-4 md:p-8">Error: {error}</p>;
  }

  if (!dashboardMetrics) {
    return <p className="p-4 md:p-8">No dashboard metrics available.</p>;
  }

  return (
    <div>
        <main className="p-4 md:p-8">
          <div className="mb-6 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl">
                {`Welcome, ${user?.name}`}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Here's a snapshot of your club's performance.
              </p>
            </div>
          </div>

          {/* Prominent Metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Students"
              value={String(dashboardMetrics.totalStudents)}
              icon={Users}
              description="Club Members"
            />
            <StatCard
              title="Problems Solved This Week"
              value={String(dashboardMetrics.problemsSolvedThisWeek)}
              icon={Code}
              description="Unique problems solved in the last 7 days."
            />
            <StatCard
              title="Problems Solved Last Week"
              value={String(dashboardMetrics.problemsSolvedLastWeek)}
              icon={Code}
              description="Unique problems solved in the 7 days prior to this week."
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* SKILL DISTRIBUTION */}
            <SkillDistribution data={dashboardMetrics.skillDistribution} totalStudents={dashboardMetrics.totalStudents} />

            {/* PROGRESS SNAPSHOT */}
            <ProgressSnapshot data={dashboardMetrics.progressSnapshot} />
          </div>

          {/* ENGAGEMENT */}
          <div className="mt-8">
            <EngagementMetrics data={dashboardMetrics.engagement} />
          </div>
        </main>
    </div>
  );
}

export default HomePage;
