"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface HeatmapProps {
  data: { date: string; count: number }[];
}

export function Heatmap({ data = [] }: HeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  // Group data into columns of 7 (representing weeks)
  const columns: { date: string; count: number }[][] = [];
  const items = [...data];

  while (items.length > 0) {
    columns.push(items.splice(0, 7));
  }



  // LeetCode dark mode colors
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-[#242424]";
    if (count === 1) return "bg-[#2b593f]";
    if (count === 2) return "bg-[#348953]";
    if (count === 3) return "bg-[#3fb774]";
    return "bg-[#4bc88a]";
  };

  // --- Calculate LeetCode-style Stats ---
  const totalSubmissions = data.reduce((acc, curr) => acc + curr.count, 0);
  const activeDays = data.filter((day) => day.count > 0).length;

  let maxStreak = 0;
  let currentStreak = 0;
  // Sort data by date ascending to calculate streak
  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  sortedData.forEach((day) => {
    if (day.count > 0) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  });

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#161616]/40 border-white/5 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold tracking-wider text-[#7A7A7A] uppercase">
          Submissions Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
        {/* Left Side: LeetCode-style Stats Panel */}
        <div className="col-span-1 flex flex-col justify-center space-y-4 border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 lg:pr-4">
          <div>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {totalSubmissions}
            </p>
            <p className="text-[10px] text-[#7A7A7A] uppercase tracking-wider font-semibold mt-0.5">
              Submissions in past year
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-lg font-bold text-white">
                {activeDays}
              </p>
              <p className="text-[9px] text-[#7A7A7A] uppercase tracking-wider font-semibold">
                Active Days
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {maxStreak} <span className="text-[10px] text-[#7A7A7A] font-normal">days</span>
              </p>
              <p className="text-[9px] text-[#7A7A7A] uppercase tracking-wider font-semibold">
                Max Streak
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Heatmap Grid */}
        <div className="col-span-1 lg:col-span-3 flex flex-col justify-between">
          <div className="overflow-x-auto pb-2 flex flex-col justify-center select-none">


            <div className="flex gap-[2px] min-w-[700px] justify-between">
              {/* Days of week labels */}
              <div className="grid grid-rows-7 gap-[3px] pr-2 text-[9px] font-medium text-[#7A7A7A] justify-items-end h-[95px] pt-0.5">
                <span>Mon</span>
                <span className="invisible">Tue</span>
                <span>Wed</span>
                <span className="invisible">Thu</span>
                <span>Fri</span>
                <span className="invisible">Sat</span>
                <span className="invisible">Sun</span>
              </div>

              {/* Heatmap Columns */}
              {columns.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                  {week.map((day) => {
                    let formattedDate = "";
                    try {
                      formattedDate = day.date ? format(parseISO(day.date), "MMM dd, yyyy") : "";
                    } catch (e) {
                      formattedDate = day.date;
                    }

                    return (
                      <div
                        key={day.date}
                        className={`h-[11px] w-[11px] rounded-[1.5px] cursor-pointer transition-all duration-150 ${getColorClass(day.count)}`}
                        onMouseEnter={() => setHoveredDay({ date: formattedDate, count: day.count })}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer: Tooltip details & Color scale legend */}
          <div className="flex items-center justify-between text-[10px] text-[#7A7A7A] mt-2 select-none border-t border-white/5 pt-2">
            {hoveredDay ? (
              <p className="font-mono font-medium text-[#B5B5B5]">
                <span className="text-[#4bc88a] font-bold">{hoveredDay.count} submissions</span> on {hoveredDay.date}
              </p>
            ) : (
              <p className="font-mono font-medium text-[#7A7A7A]">
                Hover squares to view daily activities
              </p>
            )}

            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="h-[9px] w-[9px] rounded-[1.5px] bg-[#242424]" />
              <div className="h-[9px] w-[9px] rounded-[1.5px] bg-[#2b593f]" />
              <div className="h-[9px] w-[9px] rounded-[1.5px] bg-[#348953]" />
              <div className="h-[9px] w-[9px] rounded-[1.5px] bg-[#3fb774]" />
              <div className="h-[9px] w-[9px] rounded-[1.5px] bg-[#4bc88a]" />
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
