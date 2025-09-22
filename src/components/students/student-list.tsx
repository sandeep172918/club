
'use client';

import { useState } from 'react';
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
import { FileText, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StudentDetailsDialog } from './student-details-dialog'; 
import { EditStudentDialog } from './edit-student-dialog'; 

// Define the type for the updatable fields more precisely
type EditableStudentData = Pick<Student, 'name' | 'codeforcesHandle' | 'codechefHandle'>;

interface StudentListProps {
  students: Student[];
  // onUpdateStudent now expects only the editable fields
  onUpdateStudent: (studentId: string, data: EditableStudentData) => void;
  onDeleteStudent: (studentId: string) => void;
}

export function StudentList({ students, onUpdateStudent, onDeleteStudent }: StudentListProps) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleOpenDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  if (!students || students.length === 0) {
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
                <TableHead>CodeChef Handle</TableHead>
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
                  <TableCell>
                    <a href={`https://www.codechef.com/users/${student.codechefHandle}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {student.codechefHandle}
                    </a>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDetails(student)}>
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(student)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Student</span>
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
        onSave={onUpdateStudent}
        onDelete={onDeleteStudent}
      />
    </>
  );
}
