"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressSnapshotProps {
  data: {
    improved: number;
    same: number;
    dropped: number;
    total: number;
  };
}

const ProgressSnapshot: React.FC<ProgressSnapshotProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
          <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-600">{data.improved}</p>
          <p className="text-sm text-muted-foreground">Improved</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
          <Minus className="h-8 w-8 text-gray-500 mb-2" />
          <p className="text-2xl font-bold text-gray-500">{data.same}</p>
          <p className="text-sm text-muted-foreground">Stable</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
          <TrendingDown className="h-8 w-8 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-red-600">{data.dropped}</p>
          <p className="text-sm text-muted-foreground">Dropped</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSnapshot;
