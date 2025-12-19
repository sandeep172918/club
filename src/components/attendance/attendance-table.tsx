
'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Headers are Students
interface AttendanceHeader {
  id: string;
  name: string;
}

// Rows are Contests
interface AttendanceRow {
  id: string;
  name: string;
  date: string;
  attendance: boolean[];
}

interface AttendanceTableProps {
  headers: AttendanceHeader[];
  rows: AttendanceRow[];
  studentNameFilter: string;
}

export function AttendanceTable({ headers, rows, studentNameFilter }: AttendanceTableProps) {
  const filteredStudentColumns = useMemo(() => {
    if (!studentNameFilter) {
      return headers.map((header, index) => ({ ...header, originalIndex: index }));
    }
    return headers
      .map((header, index) => ({ ...header, originalIndex: index }))
      .filter(header => header.name.toLowerCase().includes(studentNameFilter.toLowerCase()));
  }, [headers, studentNameFilter]);

  if (!headers || headers.length === 0) {
    return <p className="text-muted-foreground mt-4">No students found.</p>;
  }

  if (!rows || rows.length === 0) {
    return <p className="text-muted-foreground mt-4">No contests found to display.</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background min-w-[250px] z-10">Contest</TableHead>
              <TooltipProvider>
                {filteredStudentColumns.map((header) => (
                  <TableHead key={header.id} className="text-center min-w-[60px] h-[140px] relative">
                     <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-[120px] bg-muted">
                           <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max [writing-mode:vertical-rl] rotate-180 text-xs">
                            {header.name}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{header.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                ))}
              </TooltipProvider>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium sticky left-0 bg-background z-10">
                    {row.name}
                    <div className="text-xs text-muted-foreground">{row.date}</div>
                </TableCell>
                {filteredStudentColumns.map((studentCol) => (
                  <TableCell key={`${row.id}-${studentCol.id}`} className="text-center">
                    {row.attendance[studentCol.originalIndex] ? (
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
    </div>
  );
}
