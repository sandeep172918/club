
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Student } from '@/types';
import { Button } from '@/components/ui/button';
import { FileText, Edit, AlertCircle, Trash, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StudentDetailsDialog } from './student-details-dialog';
import { EditStudentDialog } from './edit-student-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VerifyActionDialog } from './verify-action-dialog';

// Define the type for the updatable fields more precisely
type EditableStudentData = Omit<Student, 'id' | 'secretCode' | 'currentRating' | 'problemsSolved' | 'totalContestsGiven' | 'ratingHistory' | 'contestParticipation'>;

interface StudentListProps {
  onUpdateStudent: (studentId: string, data: EditableStudentData, secretCode: string) => Promise<void>;
  onDeleteStudent: (studentId: string, secretCode: string) => Promise<void>;
  onSyncStudent: (studentId: string) => Promise<void>;
}

export function StudentList({ onUpdateStudent, onDeleteStudent, onSyncStudent }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [actionToVerify, setActionToVerify] = useState<{
    action: 'update' | 'delete';
    studentId: string;
    data?: EditableStudentData;
  } | null>(null);


  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students. Please try again later.');
      }
      const data = await response.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleOpenVerifyDialog = (
    action: 'update' | 'delete',
    studentId: string,
    data?: EditableStudentData
  ) => {
    setActionToVerify({ action, studentId, data });
    setIsVerifyOpen(true);
  };

  const handleUpdateWithVerification = async (studentId: string, data: EditableStudentData) => {
    handleOpenVerifyDialog('update', studentId, data);
    setIsEditDialogOpen(false);
  };

  const handleDeleteWithVerification = (studentId: string) => {
    handleOpenVerifyDialog('delete', studentId);
  };

  const handleConfirmVerify = async (secretCode: string) => {
    if (!actionToVerify) return;

    const { action, studentId, data } = actionToVerify;

    if (action === 'update' && data) {
      await onUpdateStudent(studentId, data, secretCode);
    } else if (action === 'delete') {
      await onDeleteStudent(studentId, secretCode);
    }

    fetchStudents(); // Refetch after action
    setActionToVerify(null);
  };

  const handleSyncAndRefetch = async (studentId: string) => {
    await onSyncStudent(studentId);
    fetchStudents();
  };


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>Loading student data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
     return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No students have been added yet. Add a student to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>List of all students currently being tracked.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Codeforces Handle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${student.name.charAt(0)}`} alt={student.name} data-ai-hint="abstract pattern" />
                        <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a href={`https://codeforces.com/profile/${student.codeforcesHandle}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {student.codeforcesHandle}
                    </a>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleSyncAndRefetch(student.id)}>
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Sync</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleOpenDetails(student)}>
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(student)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Student</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteWithVerification(student.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete Student</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <StudentDetailsDialog
        student={selectedStudent}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
      
      <EditStudentDialog
        student={selectedStudent}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdateWithVerification}
      />

      <VerifyActionDialog
        open={isVerifyOpen}
        onOpenChange={setIsVerifyOpen}
        onConfirm={handleConfirmVerify}
        title={`Confirm ${actionToVerify?.action === 'update' ? 'Update' : 'Deletion'}`}
        description={`Please enter the secret code for the student to confirm this action.`}
      />
    </>
  );
}
