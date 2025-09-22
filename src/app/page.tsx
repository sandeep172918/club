

import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { ParticipationChart } from '@/components/dashboard/participation-chart';
// import { UpcomingContestsCard } from '@/components/dashboard/upcoming-contests-card'; // Removed
import { mockStudents, mockContests } from '@/lib/mock-data';
import { Users, ListChecks, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const totalStudents = mockStudents.length;
  const totalContests = mockContests.length;
  
  // Calculate overall attendance rate (simplified)
  let totalParticipations = 0;
  let totalPossibleParticipations = 0;
  mockStudents.forEach(student => {
    student.contestParticipation.forEach(p => {
      totalPossibleParticipations++;
      if (p.participated) {
        totalParticipations++;
      }
    });
  });
  const overallAttendanceRate = totalPossibleParticipations > 0 
    ? ((totalParticipations / totalPossibleParticipations) * 100).toFixed(1) 
    : 'N/A';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of student progress and contest participation."
        // Removed actions prop that previously linked to student import
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Students" value={totalStudents} icon={Users} description="Actively tracked students" />
        <StatCard title="Contests Tracked" value={totalContests} icon={ListChecks} description="Codeforces & CodeChef" />
        <StatCard title="Attendance Rate" value={`${overallAttendanceRate}%`} icon={Percent} description="Overall contest participation" />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <OverviewChart />
        <ParticipationChart />
      </div>
      
      {/* UpcomingContestsCard removed from here as it's now a separate page */}
      
      {/* Placeholder for recent activity - keeping this commented out
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity to display.</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
