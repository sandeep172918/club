"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EngagementMetricsProps {
  data: {
    lastContestAttendance: { count: number; total: number; percentage: number };
    activeMembersThisMonth: { count: number; total: number; percentage: number };
  };
}

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium">Last Contest Attendance</h3>
          <Progress value={data.lastContestAttendance.percentage} className="h-4 mt-2" indicatorColor="bg-purple-600" />
          <p className="text-sm text-muted-foreground mt-1">
            {data.lastContestAttendance.count} / {data.lastContestAttendance.total} students ({data.lastContestAttendance.percentage.toFixed(1)}%)
          </p>
        </div>
        <div>
          <h3 className="font-medium">Active Members This Month</h3>
          <Progress value={data.activeMembersThisMonth.percentage} className="h-4 mt-2" indicatorColor="bg-orange-600" />
          <p className="text-sm text-muted-foreground mt-1">
            {data.activeMembersThisMonth.count} / {data.activeMembersThisMonth.total} students ({data.activeMembersThisMonth.percentage.toFixed(1)}%)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementMetrics;
