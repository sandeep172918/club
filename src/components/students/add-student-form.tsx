
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

// This schema defines only the fields for adding a new student.
const addStudentFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  codeforcesHandle: z.string().min(2, {
    message: 'Codeforces handle must be at least 2 characters.',
  }),
  secretCode: z.string().min(6, {
    message: 'Secret code must be at least 6 characters.',
  }),
});

// Type for the form values, derived from the schema.
type AddStudentFormValues = z.infer<typeof addStudentFormSchema>;

interface AddStudentFormProps {
  // Callback now only passes the basic student data.
  onFormSubmitSuccess: (data: AddStudentFormValues) => Promise<void>;
}

export function AddStudentForm({ onFormSubmitSuccess }: AddStudentFormProps) {
  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      name: '',
      codeforcesHandle: '',
      secretCode: '',
    },
  });

  async function onSubmit(values: AddStudentFormValues) {
    await onFormSubmitSuccess(values); // Call the async success callback
    form.reset(); // Reset form fields
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ada Lovelace" {...field} />
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
                <Input placeholder="e.g., ada_cf" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secretCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Code</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter a secret code" {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Remember or write down this password for future reference. If forgotten, contact an admin.
              </p>
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Adding...' : 'Add Student'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
