"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Helper to determine the green intensity class
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-white/[0.02] border border-white/[0.01]";
    if (count === 1) return "bg-[#7EE787]/15 border border-[#7EE787]/5";
    if (count === 2) return "bg-[#7EE787]/35 border border-[#7EE787]/10";
    if (count === 3) return "bg-[#7EE787]/60 border border-[#7EE787]/15";
    return "bg-[#7EE787] border border-[#7EE787]/20";
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Club Activity Heatmap</CardTitle>
            <CardDescription>Visualizing competitive programming activity & submissions over the last 100 days</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#7A7A7A]">
            <span>Less</span>
            <div className="h-3 w-3 rounded-sm bg-white/[0.02]" />
            <div className="h-3 w-3 rounded-sm bg-[#7EE787]/15" />
            <div className="h-3 w-3 rounded-sm bg-[#7EE787]/35" />
            <div className="h-3 w-3 rounded-sm bg-[#7EE787]/60" />
            <div className="h-3 w-3 rounded-sm bg-[#7EE787]" />
            <span>More</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="overflow-x-auto pb-2 flex flex-col justify-center select-none">
          <div className="flex gap-[4px] min-w-[700px] justify-between">
            {/* Days of week labels */}
            <div className="grid grid-rows-7 gap-[4px] pr-2 text-[9px] font-medium text-[#7A7A7A] justify-items-end h-[112px] pt-1">
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
              <div key={wIdx} className="grid grid-rows-7 gap-[4px]">
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
                      className={`h-[12px] w-[12px] rounded-[2px] cursor-pointer transition-all duration-150 ${getColorClass(day.count)}`}
                      onMouseEnter={() => setHoveredDay({ date: formattedDate, count: day.count })}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Tooltip overlay */}
        <div className="h-6 mt-2 flex items-center justify-start">
          {hoveredDay ? (
            <p className="text-xs font-mono font-medium text-[#B5B5B5] transition-all">
              <span className="text-[#7EE787] font-bold">{hoveredDay.count} active events</span> on {hoveredDay.date}
            </p>
          ) : (
            <p className="text-xs font-mono font-medium text-[#7A7A7A]">
              Hover over squares to view participation metrics
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
