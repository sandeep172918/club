"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { mockOverallRatingTrend } from "@/lib/mock-data"
import { useMemo } from "react"

const chartConfig = {
  averageRating: {
    label: "Avg. Rating",
    color: "hsl(var(--chart-1))",
  },
}

export function OverviewChart() {
  const chartData = useMemo(() => {
    return mockOverallRatingTrend.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
        <CardDescription>Average student rating over the past few months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="averageRating"
              type="monotone"
              stroke="var(--color-averageRating)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing average rating trend for all students
        </div>
      </CardFooter>
    </Card>
  )
}
