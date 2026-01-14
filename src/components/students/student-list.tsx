
'use client';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { EditStudentDialog } from './edit-student-dialog';
import { DeleteStudentDialog } from './delete-student-dialog';
import { useState } from 'react';

interface StudentListProps {
  students: Student[];
  onStudentUpdated: (updatedStudent: Student) => void;
  onStudentDeleted: (deletedStudentId: string) => void;
}

export default function StudentList({ students, onStudentUpdated, onStudentDeleted }: StudentListProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

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
                <TableHead>Email ID</TableHead>
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
                    {student.email}
                  </TableCell>
                  <TableCell>
                    {student.codeforcesHandle ? (
                      <a href={`https://codeforces.com/profile/${student.codeforcesHandle}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {student.codeforcesHandle}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">Not linked</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          setSelectedStudent(student);
                          setIsEditDialogOpen(true);
                        }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setStudentToDelete(student);
                          setIsDeleteDialogOpen(true);
                        }}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedStudent && (
        <EditStudentDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          student={selectedStudent}
          onUpdate={onStudentUpdated}
        />
      )}

      {studentToDelete && (
        <DeleteStudentDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          studentName={studentToDelete.name}
          onConfirm={async () => {
            if (studentToDelete) {
              const response = await fetch(`/api/students/${studentToDelete._id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                onStudentDeleted(studentToDelete._id!);
              } else {
                // Handle error
                console.error("Failed to delete student");
              }
            }
          }}
        />
      )}
    </>
  );
}
