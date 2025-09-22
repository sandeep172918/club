
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

// This schema defines only the fields for adding a new student.
// currentRating, problemsSolved, totalContestsGiven will be defaulted in the parent component.
const addStudentFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  codeforcesHandle: z.string().min(2, {
    message: 'Codeforces handle must be at least 2 characters.',
  }),
  codechefHandle: z.string().min(2, {
    message: 'CodeChef handle must be at least 2 characters.',
  }),
});

// Type for the form values, derived from the schema.
type AddStudentFormValues = z.infer<typeof addStudentFormSchema>;

interface AddStudentFormProps {
  // Callback now only passes the basic student data.
  onFormSubmitSuccess: (data: AddStudentFormValues) => void;
}

export function AddStudentForm({ onFormSubmitSuccess }: AddStudentFormProps) {
  const { toast } = useToast();
  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      name: '',
      codeforcesHandle: '',
      codechefHandle: '',
    },
  });

  async function onSubmit(values: AddStudentFormValues) {
    // Simulate API call / server action
    console.log('Submitting new student data:', values);
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Mock delay
    
    toast({
      title: 'Student Added (Mock)',
      description: `${values.name} has been added. (This is a mock action)`,
    });
    
    onFormSubmitSuccess(values); // Call the success callback
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
          name="codechefHandle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CodeChef Handle</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ada_cc" {...field} />
              </FormControl>
              <FormMessage />
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
