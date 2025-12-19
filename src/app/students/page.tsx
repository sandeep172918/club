
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { StudentList } from '@/components/students/student-list';
import { AddStudentForm } from '@/components/students/add-student-form';
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
import { useToast } from '@/hooks/use-toast';


// Type for data coming from the AddStudentForm
type NewStudentData = Omit<Student, 'id' | 'ratingHistory' | 'contestParticipation' | 'problemsSolved' | 'totalContestsGiven' | 'currentRating'>;

type EditableStudentData = {
    name: string;
    codeforcesHandle: string;
    gender?: string;
    email?: string;
    dob?: string;
    tshirtSize?: string;
    instituteName?: string;
};

export default function StudentsPage() {
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddStudent = async (newStudentData: NewStudentData) => {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudentData),
    });

    if (response.ok) {
      toast({ title: "Success", description: "New student has been added." });
      setIsAddStudentDialogOpen(false);
      // Data will be re-fetched by the StudentList component automatically
    } else {
      const errorData = await response.json();
      toast({
        variant: "destructive",
        title: "Error adding student",
        description: errorData.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleUpdateStudent = async (studentId: string, updatedData: EditableStudentData, secretCode: string) => {
    const response = await fetch(`/api/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updatedData, secretCode }),
    });

    if (response.ok) {
       toast({ title: "Success", description: "Student details have been updated." });
    } else {
       const errorData = await response.json();
       toast({
        variant: "destructive",
        title: "Error updating student",
        description: errorData.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleDeleteStudent = async (studentId: string, secretCode: string) => {
    const response = await fetch(`/api/students/${studentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretCode }),
    });

     if (response.ok) {
       toast({ title: "Success", description: "Student has been deleted." });
    } else {
       const errorData = await response.json();
       toast({
        variant: "destructive",
        title: "Error deleting student",
        description: errorData.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleSyncStudent = async (studentId: string) => {
    toast({ title: "Syncing...", description: "Fetching latest data from Codeforces." });
    const response = await fetch(`/api/students/${studentId}/verify`, {
      method: 'POST',
    });

    if (response.ok) {
      toast({ title: "Success", description: "Student data has been synced." });
    } else {
      const errorData = await response.json();
      toast({
        variant: "destructive",
        title: "Error syncing student",
        description: errorData.message || 'An unexpected error occurred.',
      });
    }
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
                onFormSubmitSuccess={handleAddStudent}
              />
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="mt-8">
        <StudentList 
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
          onSyncStudent={handleSyncStudent}
        />
      </div>
    </div>
  );
}
