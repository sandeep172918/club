"use client";

import AttendanceTable from "@/components/attendance/attendance-table";
import { useEffect, useState } from "react";
import { ProcessedContestAttendance, Student } from "@/types";
import { Button } from "@/components/ui/button"; // Import Button
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { useSocket } from "@/context/SocketContext";

function AttendancePage() {
  const { user } = useAuth(); // Destructure user from useAuth
  const [attendanceData, setAttendanceData] = useState<ProcessedContestAttendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]); // Keep students state for the table component
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncingContests, setSyncingContests] = useState(false);
  const { socket } = useSocket();

  const fetchData = async () => {
    // Keep loading mostly for first load
    // setLoading(true); 
    setError(null);
    try {
      // Fetch attendance data (now pre-processed by API)
      const resAttendance = await fetch("/api/attendance");
      if (!resAttendance.ok) {
        throw new Error(`HTTP error! status: ${resAttendance.status}`);
      }
      const { data: processedAttendanceData } = await resAttendance.json();
      setAttendanceData(processedAttendanceData);

      // Fetch students separately for the table headers
      const resStudents = await fetch("/api/students");
      if (!resStudents.ok) {
        throw new Error(`HTTP error! status: ${resStudents.status}`);
      }
      const { data: studentsData } = await resStudents.json();
      setStudents(studentsData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data: any) => {
        if (['STUDENT_UPDATED', 'ATTENDANCE_UPDATED', 'CONTEST_ADDED'].includes(data.type)) {
            fetchData();
        }
    };
    socket.on("data_update", handleUpdate);
    return () => {
        socket.off("data_update", handleUpdate);
    };
  }, [socket]);

  const handleUpdateAttendance = async () => {
    // This button now primarily triggers a refresh of the attendance data
    // The attendance API itself will fetch fresh Codeforces contests
    // The student participation updates are handled by the "Sync Students" on the Students page
    await fetchData();
    socket?.emit('data_update', { type: 'ATTENDANCE_UPDATED' });
  };


  const handleSyncContests = async () => {
    setSyncingContests(true);
    setError(null);
    try {
      const res = await fetch("/api/contests", { method: "GET" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // After syncing contests in the local DB, refetch attendance data to potentially show new contests
      await fetchData();
      socket?.emit('data_update', { type: 'ATTENDANCE_UPDATED' });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSyncingContests(false);
    }
  };


  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (attendanceData.length === 0) return <p>No attendance data available.</p>;


  return (
    <main className="p-4 md:p-8">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl">
            Attendance Tracker
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor participation in recent contests.
          </p>
        </div>
        {user?.role === "admin" && (
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <Button onClick={handleUpdateAttendance}>Update Attendance</Button>
            {user?.role === "admin" && (
              <Button
                onClick={handleSyncContests}
                disabled={syncingContests}
              >
                {syncingContests ? "Syncing..." : "Sync Contests"}
              </Button>
            )}
          </div>
        )}
      </div>
      <AttendanceTable attendanceData={attendanceData} students={students} />
    </main>
  );
}

export default AttendancePage;