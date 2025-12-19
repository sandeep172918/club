"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  participants: {
    label: "Participants",
    color: "hsl(var(--chart-1))",
  },
}

interface ParticipationChartProps {
  data: {
    name: string;
    participants: number;
  }[];
}

export function ParticipationChart({ data }: ParticipationChartProps) {
  const showChart = data && data.length > 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Contest Participation</CardTitle>
        <CardDescription>Participation numbers for the last 5 contests.</CardDescription>
      </CardHeader>
      <CardContent>
        {showChart ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 15) + (value.length > 15 ? "..." : "")}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="participants" fill="var(--color-participants)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No recent contest data available.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
