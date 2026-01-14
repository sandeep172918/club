
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
import { CheckCircle, XCircle } from 'lucide-react';
import type { ProcessedContestAttendance, Student } from '@/types';
import { format } from 'date-fns';

interface AttendanceTableProps {
  attendanceData: ProcessedContestAttendance[];
  students: Student[];
}

export default function AttendanceTable({ attendanceData, students }: AttendanceTableProps) {
  // Sort students by name for consistent column order
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px] sticky left-0 bg-background z-10">Contest Name</TableHead>
            <TableHead className="min-w-[100px] text-center">Participation %</TableHead>
            {sortedStudents.map((student) => (
              <TableHead key={student._id} className="text-center min-w-[120px]">
                {student.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((contest) => {
             const participatingCount = sortedStudents.reduce((acc, student) => {
               return acc + (contest.studentAttendance[student._id!] ? 1 : 0);
             }, 0);
             const percentage = sortedStudents.length > 0 
               ? Math.round((participatingCount / sortedStudents.length) * 100) 
               : 0;

             return (
              <TableRow key={contest.contestId}>
                <TableCell className="font-medium sticky left-0 bg-background z-10">
                  <div className="flex flex-col">
                    <span>{contest.contestName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(contest.contestDate), 'MMM dd, yyyy')}
                    </span>
                    <Badge variant="secondary" className="text-xs w-fit mt-1">
                      {contest.platform}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold">
                  {percentage}%
                </TableCell>
                {sortedStudents.map((student) => {
                  const participated = contest.studentAttendance[student._id!];
                  return (
                    <TableCell key={`${contest.contestId}-${student._id}`} className="text-center">
                      {participated ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}