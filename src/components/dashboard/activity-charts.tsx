"use client";

import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Recharts Custom Tooltip Styled to match Premium Enterprise look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/5 bg-[#161616] p-3 shadow-xl">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A7A]">{label}</p>
        <p className="text-sm font-bold text-white mt-1">
          {payload[0].value} <span className="text-[11px] font-normal text-[#B5B5B5]">{payload[0].name}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface ActivityChartsProps {
  ratingDistribution: { range: string; count: number }[];
  difficultyBreakdown: { difficulty: string; count: number }[];
  averageRatingHistory: { date: string; averageRating: number }[];
}

export function ActivityCharts({ 
  ratingDistribution, 
  difficultyBreakdown,
  averageRatingHistory 
}: ActivityChartsProps) {
  
  // Format data for difficulty breakdown to ensure labels look nice
  const diffData = difficultyBreakdown || [];
  const distData = ratingDistribution || [];
  const historyData = averageRatingHistory || [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      
      {/* Chart 1: Club Rating Trend (Weekly Activity / Average Rating History) */}
      <Card className="col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Club Rating Trend</CardTitle>
          <CardDescription>Average active rating performance across the club over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7EE787" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#7EE787" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
              <XAxis 
                dataKey="date" 
                stroke="#7A7A7A" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#7A7A7A" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="averageRating" 
                name="Avg Rating"
                stroke="#7EE787" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorRating)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Rating Distribution */}
      <Card className="col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Rating Distribution</CardTitle>
          <CardDescription>Number of active club members per Codeforces rating tier</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
              <XAxis 
                dataKey="range" 
                stroke="#7A7A7A" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={10}
                tickFormatter={(val) => val.split(' ')[0]} // Shorten labels
              />
              <YAxis 
                stroke="#7A7A7A" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                name="Members"
                fill="#7EE787" 
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
