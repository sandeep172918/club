"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // Assuming Progress can be used for battery style

interface SkillDistributionProps {
  data: {
    beginner: { count: number; percentage: number };
    intermediate: { count: number; percentage: number };
    advanced: { count: number; percentage: number };
  };
  totalStudents: number;
}

const SkillDistribution: React.FC<SkillDistributionProps> = ({ data, totalStudents }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Beginner {'(<1400)'}</h3>
          <Progress value={data.beginner.percentage} className="h-4 mt-2" indicatorColor="bg-blue-600" />
          <p className="text-sm text-muted-foreground mt-1">
            {data.beginner.count} students ({data.beginner.percentage.toFixed(1)}%)
          </p>
        </div>
        <div>
          <h3 className="font-medium">Intermediate {'(1400-1600)'}</h3>
          <Progress value={data.intermediate.percentage} className="h-4 mt-2" indicatorColor="bg-green-600" />
          <p className="text-sm text-muted-foreground mt-1">
            {data.intermediate.count} students ({data.intermediate.percentage.toFixed(1)}%)
          </p>
        </div>
        <div>
          <h3 className="font-medium">Advanced {'(>1600)'}</h3>
          <Progress value={data.advanced.percentage} className="h-4 mt-2" indicatorColor="bg-red-600" />
          <p className="text-sm text-muted-foreground mt-1">
            {data.advanced.count} students ({data.advanced.percentage.toFixed(1)}%)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillDistribution;
