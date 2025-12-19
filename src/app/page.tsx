
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { ParticipationChart } from '@/components/dashboard/participation-chart';
import { Users, BarChart, LineChart, Trophy, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TopRatedStudentsCard } from '@/components/dashboard/top-rated-card';


interface DashboardData {
  totalStudents: number;
  topRatedStudents: { name: string; codeforcesHandle: string; currentRating: number }[];
  participation: { name: string; participants: number }[];
  overallProgress: { date: string; averageRating: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error(`Error fetching dashboard data: ${await response.text()}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of student progress and contest participation."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of student progress and contest participation."
      />

      <div className="grid gap-6">
        <StatCard title="Total Students" value={data.totalStudents} icon={Users} description="Actively tracked students" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopRatedStudentsCard students={data.topRatedStudents} />
        <ParticipationChart data={data.participation} />
      </div>

      <div className="grid gap-6">
        <OverviewChart data={data.overallProgress} />
      </div>
      
    </div>
  );
}
