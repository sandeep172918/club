
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Student } from '@/types';
import { UserCircle, Star, CheckSquare, ListChecks } from 'lucide-react';

interface StudentDetailsDialogProps {
  student: Student | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({ student, isOpen, onOpenChange }: StudentDetailsDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCircle className="mr-2 h-6 w-6 text-primary" />
            {student.name} - Details
          </DialogTitle>
          <DialogDescription>
            Overview of student's performance and activity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              <Star className="mr-2 h-4 w-4 text-yellow-500" />
              Current Rating:
            </span>
            <span className="font-semibold text-lg">{student.currentRating}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              <CheckSquare className="mr-2 h-4 w-4 text-green-500" />
              Problems Solved:
            </span>
            <span className="font-semibold">{student.problemsSolved}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              <ListChecks className="mr-2 h-4 w-4 text-blue-500" />
              Total Contests:
            </span>
            <span className="font-semibold">{student.totalContestsGiven}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Codeforces:</span>
            <a 
              href={`https://codeforces.com/profile/${student.codeforcesHandle}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              {student.codeforcesHandle}
            </a>
          </div>
          {student.email && (
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Email:</span>
              <span>{student.email}</span>
            </div>
          )}
          {student.gender && (
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Gender:</span>
              <span>{student.gender}</span>
            </div>
          )}
          {student.dob && (
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Date of Birth:</span>
              <span>{student.dob}</span>
            </div>
          )}
          {student.tshirtSize && (
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">T-Shirt Size:</span>
              <span>{student.tshirtSize}</span>
            </div>
          )}
          {student.instituteName && (
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Institute:</span>
              <span>{student.instituteName}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
