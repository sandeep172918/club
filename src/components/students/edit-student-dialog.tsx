
'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/types';
import { UserCircle, CheckCircle, Trash2 } from 'lucide-react';

// Removed problemsSolved and totalContestsGiven from the schema
const editStudentFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  codeforcesHandle: z.string().min(2, { message: 'Codeforces handle must be at least 2 characters.' }),
  codechefHandle: z.string().min(2, { message: 'CodeChef handle must be at least 2 characters.' }),
});

type EditStudentFormValues = z.infer<typeof editStudentFormSchema>;

interface EditStudentDialogProps {
  student: Student | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // onSave now takes EditStudentFormValues which doesn't include problemsSolved/totalContestsGiven
  onSave: (studentId: string, data: EditStudentFormValues) => void;
  onDelete: (studentId: string) => void;
}

export function EditStudentDialog({ student, isOpen, onOpenChange, onSave, onDelete }: EditStudentDialogProps) {
  const { toast } = useToast();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const form = useForm<EditStudentFormValues>({
    resolver: zodResolver(editStudentFormSchema),
    defaultValues: {
      name: '',
      codeforcesHandle: '',
      codechefHandle: '',
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        codeforcesHandle: student.codeforcesHandle,
        codechefHandle: student.codechefHandle,
        // problemsSolved and totalContestsGiven are no longer form fields
      });
    }
  }, [student, form, isOpen]);

  if (!student) return null;

  const handleVerifyCodeforces = () => {
    toast({
      title: 'Verification Simulated',
      description: `Verification for ${form.getValues('codeforcesHandle')} would happen here.`,
    });
  };

  const onSubmit = (values: EditStudentFormValues) => {
    onSave(student.id, values);
    toast({
      title: 'Student Updated',
      description: `${values.name}'s details have been updated. (Mock action)`,
    });
    onOpenChange(false); // Close the dialog
  };

  const handleDeleteConfirm = () => {
    onDelete(student.id);
    toast({
      title: 'Student Deleted',
      description: `${student.name} has been removed from the system. (Mock action)`,
      variant: 'destructive',
    });
    setIsDeleteAlertOpen(false);
    onOpenChange(false); // Close the main edit dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCircle className="mr-2 h-6 w-6 text-primary" />
            Edit {student.name}
          </DialogTitle>
          <DialogDescription>
            Update student details or remove them from the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codeforcesHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codeforces Handle</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input {...field} className="flex-grow" />
                    </FormControl>
                    <Button type="button" variant="outline" size="sm" onClick={handleVerifyCodeforces}>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Verify
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codechefHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CodeChef Handle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Removed FormFields for problemsSolved and totalContestsGiven */}
            <DialogFooter className="pt-4 flex flex-row justify-between items-center w-full">
              <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Student
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the student
                      and remove their data from related records.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>
                      Yes, delete student
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
