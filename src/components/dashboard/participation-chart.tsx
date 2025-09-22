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
import { mockRecentContestParticipation } from "@/lib/mock-data"

const chartConfig = {
  participation: {
    label: "Participated",
    color: "hsl(var(--chart-1))",
  },
  nonParticipation: {
    label: "Not Participated",
    color: "hsl(var(--chart-2))",
  },
}

export function ParticipationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Contest Participation</CardTitle>
        <CardDescription>Participation numbers for the last few contests.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={mockRecentContestParticipation} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="contestName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 10) + "..."} // Shorten labels if needed
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
            <Bar dataKey="participation" fill="var(--color-participation)" radius={4} />
            <Bar dataKey="nonParticipation" fill="var(--color-nonParticipation)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
