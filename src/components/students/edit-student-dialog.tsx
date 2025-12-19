
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Student } from '@/types';
import { UserCircle, Loader2 } from 'lucide-react';

const editStudentFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  codeforcesHandle: z.string().min(2, { message: 'Codeforces handle must be at least 2 characters.' }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  gender: z.string().optional(),
  dob: z.string().optional(),
  tshirtSize: z.string().optional(),
  instituteName: z.string().optional(),
});

type EditStudentFormValues = z.infer<typeof editStudentFormSchema>;

interface EditStudentDialogProps {
  student: Student | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (studentId: string, data: EditStudentFormValues) => Promise<void>;
}

export function EditStudentDialog({ student, isOpen, onOpenChange, onSave }: EditStudentDialogProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EditStudentFormValues>({
    resolver: zodResolver(editStudentFormSchema),
    defaultValues: {
      name: '',
      codeforcesHandle: '',
      email: '',
      gender: '',
      dob: '',
      tshirtSize: '',
      instituteName: '',
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        codeforcesHandle: student.codeforcesHandle,
        email: student.email || '',
        gender: student.gender || '',
        dob: student.dob || '',
        tshirtSize: student.tshirtSize || '',
        instituteName: student.instituteName || '',
      });
    }
  }, [student, form, isOpen]);

  if (!student) return null;

  const onSubmit = async (values: EditStudentFormValues) => {
    if (!student) return;
    setIsSaving(true);
    await onSave(student.id, values);
    setIsSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCircle className="mr-2 h-6 w-6 text-primary" />
            Edit {student.name}
          </DialogTitle>
          <DialogDescription>
            Update the student's details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
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
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="student@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Male, Female, Non-binary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tshirtSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>T-Shirt Size (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., M, L, XL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="instituteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institute Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., University of Example" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 flex flex-row justify-end items-center w-full sticky bottom-0 bg-background py-4">
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isSaving}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
