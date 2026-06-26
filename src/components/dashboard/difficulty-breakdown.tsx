"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SkillTier {
  count: number;
  color: string;
  rank: string;
}

interface DifficultyBreakdownProps {
  skillDistribution: {
    beginner: number;
    pupil: number;
    specialist: number;
    expert: number;
    master: number;
  };
  difficultyBreakdown: { difficulty: string; count: number }[];
  totalStudents: number;
}

export function DifficultyBreakdown({
  skillDistribution,
  difficultyBreakdown = [],
  totalStudents
}: DifficultyBreakdownProps) {
  
  const skillTiers: { [key: string]: SkillTier } = {
    beginner: { count: skillDistribution?.beginner || 0, color: "bg-[#7A7A7A]/30", rank: "Newbie (<1200)" },
    pupil: { count: skillDistribution?.pupil || 0, color: "bg-[#7EE787]/20", rank: "Pupil (1200-1399)" },
    specialist: { count: skillDistribution?.specialist || 0, color: "bg-[#7EE787]/40", rank: "Specialist (1400-1599)" },
    expert: { count: skillDistribution?.expert || 0, color: "bg-[#7EE787]/70", rank: "Expert (1600-1899)" },
    master: { count: skillDistribution?.master || 0, color: "bg-[#7EE787]", rank: "Master+ (≥1900)" }
  };

  const totalDiffSolved = difficultyBreakdown.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Skill Distribution Battery */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Skill Level Breakdown</CardTitle>
          <CardDescription>Club hierarchy categorized by official Codeforces ranks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {Object.entries(skillTiers).map(([key, tier]) => {
            const pct = totalStudents > 0 ? (tier.count / totalStudents) * 100 : 0;
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{tier.rank}</span>
                  <span className="font-mono text-[#B5B5B5]">
                    {tier.count} {tier.count === 1 ? 'member' : 'members'} ({Math.round(pct)}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.02] overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${tier.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Problem Difficulty Breakdown */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Problem Difficulty Distribution</CardTitle>
          <CardDescription>Breakdown of solved practice problems categorized by Codeforces difficulty ratings</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {difficultyBreakdown.map((item) => {
            const pct = (item.count / totalDiffSolved) * 100;
            return (
              <div key={item.difficulty} className="flex items-center justify-between gap-4">
                <div className="w-20 text-xs font-semibold text-[#B5B5B5] font-mono">
                  {item.difficulty}
                </div>
                <div className="flex-1 h-3 rounded-md bg-white/[0.02] overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full bg-[#7EE787]/40 rounded-r-sm transition-all duration-500" 
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-14 text-right text-xs font-mono font-semibold text-white">
                  {item.count} <span className="text-[10px] text-[#7A7A7A]">solves</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
