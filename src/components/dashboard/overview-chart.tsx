"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
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

const chartConfig = {
  averageRating: {
    label: "Avg. Rating",
    color: "hsl(var(--chart-1))",
  },
}

interface OverviewChartProps {
  data: {
    date: string;
    averageRating: number;
  }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  const showChart = data && data.length > 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
        <CardDescription>Average student rating across all contests.</CardDescription>
      </CardHeader>
      <CardContent>
        {showChart ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart
              accessibilityLayer
              data={data}
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
                name="Average Rating"
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Not enough contest data to show progress trend.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing average rating trend for all students across all contests.
        </div>
      </CardFooter>
    </Card>
  )
}
