"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Users, Code, Award, TrendingUp, TrendingDown } from "lucide-react";

interface SparklineItem {
  value: number;
}

interface WeeklySummaryProps {
  totalStudents: number;
  problemsSolvedThisWeek: number;
  problemsSolvedLastWeek: number;
  averageRating: number;
  progressSnapshot: {
    improved: number;
    same: number;
    dropped: number;
  };
  upcomingContestsCount: number;
}

export function WeeklySummary({
  totalStudents = 0,
  problemsSolvedThisWeek = 0,
  problemsSolvedLastWeek = 0,
  averageRating = 0,
  progressSnapshot,
  upcomingContestsCount = 0
}: WeeklySummaryProps) {
  
  // Calculate percentage change for weekly problems solved
  const diff = problemsSolvedThisWeek - problemsSolvedLastWeek;
  const pctChange = problemsSolvedLastWeek > 0 
    ? Math.round((diff / problemsSolvedLastWeek) * 100) 
    : 0;

  // Mock sparkline data generating subtle wave forms matching each metric
  const generateSparklineData = (seed: number, count: number = 8) => {
    return Array.from({ length: count }, (_, i) => ({
      value: seed + Math.sin(i * 1.5) * (seed * 0.08) + (i * (seed * 0.015))
    }));
  };

  const solveSparkline = generateSparklineData(problemsSolvedThisWeek || 10, 10);
  const ratingSparkline = generateSparklineData(averageRating || 1200, 10);
  const membersSparkline = generateSparklineData(totalStudents || 20, 10);
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      
      {/* Large Weekly Summary Card (Prominent Metric) */}
      <Card className="col-span-1 md:col-span-2 xl:col-span-2 relative overflow-hidden bg-gradient-to-r from-[#161616] to-[#1a1a1a]">
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A7A]">Weekly Summary</span>
              <h2 className="text-[28px] font-bold tracking-tight text-white leading-tight">
                {problemsSolvedThisWeek} Problems Solved
              </h2>
              <p className="text-xs text-[#B5B5B5] flex items-center gap-1.5 mt-1">
                {pctChange >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-[#7EE787]" />
                    <span className="text-[#7EE787] font-semibold">+{pctChange}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-[#F85149]" />
                    <span className="text-[#F85149] font-semibold">{pctChange}%</span>
                  </>
                )}
                <span>from last week (previously {problemsSolvedLastWeek})</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Code className="h-5 w-5 text-[#7EE787]" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Sparkline */}
          <div className="h-10 mt-6 w-full opacity-65">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={solveSparkline}>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7EE787" 
                  strokeWidth={1.5} 
                  fillOpacity={0.05} 
                  fill="#7EE787" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* KPI 2: Club Average Rating */}
      <Card>
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A7A]">Average Rating</span>
              <h2 className="text-[28px] font-bold tracking-tight text-white leading-tight">
                {averageRating}
              </h2>
              <p className="text-xs text-[#B5B5B5] mt-1">
                Codeforces rating average
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Award className="h-5 w-5 text-[#7EE787]" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Sparkline */}
          <div className="h-10 mt-6 w-full opacity-65">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ratingSparkline}>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7EE787" 
                  strokeWidth={1.5} 
                  fillOpacity={0.05} 
                  fill="#7EE787" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* KPI 3: Total Members */}
      <Card>
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A7A]">Total Members</span>
              <h2 className="text-[28px] font-bold tracking-tight text-white leading-tight">
                {totalStudents}
              </h2>
              <p className="text-xs text-[#B5B5B5] mt-1">
                Active student profiles
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Users className="h-5 w-5 text-[#7EE787]" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Sparkline */}
          <div className="h-10 mt-6 w-full opacity-65">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={membersSparkline}>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7EE787" 
                  strokeWidth={1.5} 
                  fillOpacity={0.05} 
                  fill="#7EE787" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
