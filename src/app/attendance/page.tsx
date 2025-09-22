
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { AttendanceTable } from '@/components/attendance/attendance-table';
import { mockAttendance, mockStudents, mockContests } from '@/lib/mock-data';
import type { Student, Contest, AttendanceEntry, ProcessedContestAttendance } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// TODO: Add filtering options (e.g., by contest)
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AttendancePage() {
  const allStudents: Student[] = mockStudents;
  const contests: Contest[] = mockContests;
  const attendanceEntries: AttendanceEntry[] = mockAttendance;

  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  const filteredStudentsForDisplay = useMemo(() => {
    if (!studentSearchTerm) {
      return allStudents;
    }
    return allStudents.filter(student =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
    );
  }, [allStudents, studentSearchTerm]);

  const processedDataForTable: ProcessedContestAttendance[] = useMemo(() => {
    return contests.map(contest => {
      const studentAttendanceStatus: Record<string, boolean> = {};
      let attendedCount = 0;

      allStudents.forEach(student => {
        const entry = attendanceEntries.find(
          att => att.studentId === student.id && att.contestId === contest.id
        );
        const participated = entry ? entry.participated : false;
        studentAttendanceStatus[student.id] = participated;
        if (participated) {
          attendedCount++;
        }
      });

      const attendancePercentage = allStudents.length > 0 
        ? (attendedCount / allStudents.length) * 100 
        : 0;

      return {
        contestId: contest.id,
        contestName: contest.name,
        contestDate: contest.date,
        platform: contest.platform,
        attendancePercentage: parseFloat(attendancePercentage.toFixed(1)),
        studentAttendance: studentAttendanceStatus,
      };
    });
  }, [contests, allStudents, attendanceEntries]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Tracking"
        description="Monitor student participation in coding contests."
      />
      
      <div className="flex space-x-4 mb-4">
        <Input 
          placeholder="Filter by student name..." 
          className="max-w-sm" 
          value={studentSearchTerm}
          onChange={(e) => setStudentSearchTerm(e.target.value)}
        />
        {/* 
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by contest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contests</SelectItem>
            {mockContests.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        */}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contest Participation Log</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceTable data={processedDataForTable} students={filteredStudentsForDisplay} />
        </CardContent>
      </Card>
    </div>
  );
}
