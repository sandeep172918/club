
"use client";
import StudentList from "@/components/students/student-list";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { AddStudentDialog } from "@/components/students/add-student-dialog";
import { useToast } from "@/hooks/use-toast";

function StudentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isSyncingAllStudents, setIsSyncingAllStudents] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const { toast } = useToast();

  // Function to update a student in the local state
  const handleStudentUpdated = useCallback((updatedStudent: Student) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s._id === updatedStudent._id ? updatedStudent : s))
    );
  }, []);

  // Function to remove a student from the local state
  const handleStudentDeleted = useCallback((deletedStudentId: string) => {
    setStudents((prevStudents) =>
      prevStudents.filter((s) => s._id !== deletedStudentId)
    );
  }, []);

  const handleStudentAdded = useCallback((newStudent: Student) => {
      setStudents((prev) => [...prev, newStudent]);
  }, []);

  const handleSyncAllStudents = async () => {
    setIsSyncingAllStudents(true);
    try {
      const response = await fetch('/api/students/sync-all-participation', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to sync all students participation.');
      }
      // Re-fetch students to update the list after sync
      const res = await fetch("/api/students");
      const { data } = await res.json();
      setStudents(data);
      toast({
        title: "Success",
        description: "All students participation synced successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Sync Error",
        description: error.message,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSyncingAllStudents(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch("/api/students");
      const { data } = await res.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <main className="p-4 md:p-8">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:truncate sm:text-4xl">
            Manage Students
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add, edit, or remove student profiles.
          </p>
        </div>
        <div className="mt-4 flex gap-4 md:mt-0 md:ml-4">
          <Button onClick={() => setIsAddStudentDialogOpen(true)} variant="secondary">
             Add Student
          </Button>
          <Button
            onClick={handleSyncAllStudents}
            disabled={isSyncingAllStudents}
          >
            {isSyncingAllStudents ? "Syncing All..." : "Sync All Students"}
          </Button>
        </div>
      </div>
      <StudentList
        students={students}
        onStudentUpdated={handleStudentUpdated}
        onStudentDeleted={handleStudentDeleted}
      />
      
      <AddStudentDialog 
        isOpen={isAddStudentDialogOpen} 
        onClose={() => setIsAddStudentDialogOpen(false)} 
        onStudentAdded={handleStudentAdded}
      />
    </main>
  );
}

export default StudentsPage;
