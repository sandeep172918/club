
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ProcessedContestAttendance, Student } from '@/types';
import { CheckCircle2, XCircle, PercentIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceTableProps {
  data: ProcessedContestAttendance[];
  students: Student[];
}

export function AttendanceTable({ data, students }: AttendanceTableProps) {
  if (data.length === 0) {
    return <p className="text-muted-foreground">No attendance data to display.</p>;
  }
  
  if (students.length === 0 && data.length > 0) {
     return <p className="text-muted-foreground">No students match your search criteria, but attendance data exists.</p>;
  }


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[200px]">Contest</TableHead>
          <TableHead>Platform</TableHead>
          <TableHead className="text-center w-[100px]">
            <div className="flex items-center justify-center">
              <PercentIcon className="h-4 w-4 mr-1" /> Att.
            </div>
          </TableHead>
          {students.map((student) => (
            <TableHead key={student.id} className="text-center min-w-[120px]">{student.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((contestEntry) => (
          <TableRow key={contestEntry.contestId}>
            <TableCell className="font-medium">
              {contestEntry.contestName}
              <div className="text-xs text-muted-foreground">
                {format(new Date(contestEntry.contestDate), 'MMM dd, yyyy')}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={contestEntry.platform === 'Codeforces' ? 'default' : 'secondary'}>
                {contestEntry.platform}
              </Badge>
            </TableCell>
            <TableCell className="text-center font-medium">
              {contestEntry.attendancePercentage}%
            </TableCell>
            {students.map((student) => (
              <TableCell key={student.id} className="text-center">
                {contestEntry.studentAttendance[student.id] ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 inline" aria-label="Attended" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 inline" aria-label="Not Attended" />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
