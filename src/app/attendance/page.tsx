"use client";

import AttendanceTable from "@/components/attendance/attendance-table";
import { useEffect, useState } from "react";
import { ProcessedContestAttendance, Student, Club } from "@/types";
import { Button } from "@/components/ui/button"; // Import Button
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { useSocket } from "@/context/SocketContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DecryptedText from "@/components/ui/decrypted-text";

function AttendancePage() {
  const { user } = useAuth(); // Destructure user from useAuth
  const [attendanceData, setAttendanceData] = useState<ProcessedContestAttendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]); // Keep students state for the table component
  const [selectedYear, setSelectedYear] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>("all");
  const { socket } = useSocket();

  const fetchData = async () => {
    setError(null);
    try {
      const clubId = user?.role === "super_admin" 
        ? selectedClubId 
        : (typeof user?.clubId === 'object' && user?.clubId ? (user.clubId as any)._id : (user?.clubId || "none"));

      const resAttendance = await fetch(`/api/attendance?clubId=${clubId}`);
      if (!resAttendance.ok) {
        throw new Error(`HTTP error! status: ${resAttendance.status}`);
      }
      const { data: processedAttendanceData } = await resAttendance.json();
      setAttendanceData(processedAttendanceData);

      const resStudents = await fetch(`/api/students?clubId=${clubId}`);
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
    if (user?.role === "super_admin") {
      fetch("/api/clubs?all=true")
        .then(res => res.json())
        .then(json => {
          if (json.success) setClubs(json.data);
        });
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [selectedClubId, user]);

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

  // 30-second polling fallback auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleUpdateAttendance = async () => {
    // This button now primarily triggers a refresh of the attendance data
    // The attendance API itself will fetch fresh Codeforces contests
    // The student participation updates are handled by the "Sync Students" on the Students page
    await fetchData();
    socket?.emit('data_update', { type: 'ATTENDANCE_UPDATED' });
  };




  const filteredStudents = students.filter((student) => {
    if (selectedYear === "All") return true;
    const targetGradYear = parseInt(selectedYear);
    if (isNaN(targetGradYear)) return true;
    
    if (student.graduatingYear) {
      return student.graduatingYear === targetGradYear;
    }
    return false;
  });

  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (attendanceData.length === 0) return <p>No attendance data available.</p>;


  return (
    <main className="p-4 md:p-8">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <DecryptedText
            text="Attendance Tracker"
            animateOn="view"
            speed={100}
            className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor participation in recent contests.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mt-4 md:mt-0">
          {user?.role === "super_admin" && (
            <div className="w-[200px]">
              <Select value={selectedClubId} onValueChange={setSelectedClubId}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clubs</SelectItem>
                  {clubs.map((club) => (
                    <SelectItem key={club._id} value={club._id!}>
                      {club.logo || "🚀"} {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="w-[180px]">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Years</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
                <SelectItem value="2029">2029</SelectItem>
                <SelectItem value="2030">2030</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <AttendanceTable attendanceData={attendanceData} students={filteredStudents} />
    </main>
  );
}

export default AttendancePage;