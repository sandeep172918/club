
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { AttendanceTable } from '@/components/attendance/attendance-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Loader2 } from 'lucide-react';

// Headers are now Students
interface AttendanceHeader {
  id: string;
  name: string;
}

// Rows are now Contests
interface AttendanceRow {
  id: string;
  name: string;
  date: string;
  attendance: boolean[];
}

export default function AttendancePage() {
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [headers, setHeaders] = useState<AttendanceHeader[]>([]);
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  async function fetchAttendanceData() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/attendance');
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data.');
      }
      const data = await response.json();
      setHeaders(data.headers); // Now an array of students
      setRows(data.rows); // Now an array of contests
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleSyncContests = async () => {
    setIsSyncing(true);
    toast({ title: 'Syncing Contests...', description: 'Fetching latest contest list from Codeforces.' });
    try {
        const response = await fetch('/api/contests', { method: 'POST' });
        if (!response.ok) {
            throw new Error('Failed to sync contests.');
        }
        const result = await response.json();
        toast({ title: 'Sync Complete', description: `${result.upsertedCount + result.modifiedCount} contests were updated.` });
        await fetchAttendanceData(); // Refresh attendance data
    } catch (err: any) {
        toast({ variant: 'destructive', title: 'Sync Failed', description: err.message });
    } finally {
        setIsSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Tracking"
        description="Student participation across all tracked contests."
        actions={
            <Button onClick={handleSyncContests} disabled={isSyncing}>
                {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Sync Contests
            </Button>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Contest Participation Log</CardTitle>
          <CardDescription>
            Use the search box to filter students by name.
          </CardDescription>
          <div className="pt-4">
             <Input 
              placeholder="Filter by student name..." 
              className="max-w-sm" 
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2 mt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
             <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <AttendanceTable 
              headers={headers} 
              rows={rows} 
              studentNameFilter={studentSearchTerm}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
