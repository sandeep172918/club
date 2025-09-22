
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { StudentList } from '@/components/students/student-list';
import { AddStudentForm } from '@/components/students/add-student-form';
import { mockStudents } from '@/lib/mock-data';
import type { Student } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

// Type for data coming from the AddStudentForm
type NewStudentData = Omit<Student, 'id' | 'ratingHistory' | 'contestParticipation' | 'problemsSolved' | 'totalContestsGiven' | 'currentRating'>;

// Type for data coming from the EditStudentForm (name, cfHandle, ccHandle only)
type EditableStudentData = Pick<Student, 'name' | 'codeforcesHandle' | 'codechefHandle'>;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);

  const handleAddStudent = (newStudentData: NewStudentData) => {
    const newStudent: Student = {
      ...newStudentData,
      id: String(Date.now()), // Mock ID
      currentRating: 0, 
      problemsSolved: 0, // Default for new students
      totalContestsGiven: 0, // Default for new students
      ratingHistory: [],
      contestParticipation: [],
    };
    setStudents(prevStudents => [newStudent, ...prevStudents]); // Add to the beginning of the list
  };

  // Updated to accept only editable fields
  const handleUpdateStudent = (studentId: string, updatedData: EditableStudentData) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, ...updatedData } : student
      )
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
  };


  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Students"
        description="Add new students, view details, and edit existing student profiles."
        actions={
          <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the details for the new student. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <AddStudentForm 
                onFormSubmitSuccess={(data) => {
                  handleAddStudent(data);
                  setIsAddStudentDialogOpen(false);
                }} 
              />
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="mt-8">
        <StudentList 
          students={students} 
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      </div>
    </div>
  );
}
