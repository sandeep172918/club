
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/page-header';
import { ContestListCard } from '@/components/contest-arena/contest-list-card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { Contest } from '@/types';

// New interfaces
interface DisplayContest extends Contest {
  formattedDateString: string;
}

const addContestFormSchema = z.object({
  name: z.string().min(3, { message: 'Contest name must be at least 3 characters.' }),
  date: z.string().min(1, { message: 'Date and time cannot be empty.' }),
  link: z.string().url({ message: 'Invalid URL for contest link.' }),
  adminCode: z.string().min(1, { message: 'Admin code is required.' }),
});

type AddContestFormValues = z.infer<typeof addContestFormSchema>;

export default function ContestArenaPage() {
  const [isAddContestDialogOpen, setIsAddContestDialogOpen] = useState(false);
  const [contests, setContests] = useState<DisplayContest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddContestFormValues>({
    resolver: zodResolver(addContestFormSchema),
    defaultValues: { name: '', date: '', link: '', adminCode: '' },
  });

  const fetchContests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/contests');
      if (!response.ok) throw new Error('Failed to fetch contests.');
      const data: Contest[] = await response.json();
      const processedContests: DisplayContest[] = data.map(contest => ({
        ...contest,
        formattedDateString: new Date(contest.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      }));
      setContests(processedContests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleContestAdded = () => {
    fetchContests();
  };

  async function onFormSubmit(values: AddContestFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/custom-contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add custom contest.');
      }
      toast({ title: 'Contest Added', description: 'Your custom contest has been successfully added.' });
      form.reset();
      setIsAddContestDialogOpen(false);
      handleContestAdded();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error Adding Contest', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const now = new Date();
  const upcomingContests = contests.filter(c => new Date(c.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const finishedContests = contests.filter(c => new Date(c.date) <= now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Dialog open={isAddContestDialogOpen} onOpenChange={setIsAddContestDialogOpen}>
      <div className="space-y-6">
        <PageHeader
          title="Contest Arena"
          description="Browse upcoming and finished contests."
          actions={
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Contest
              </Button>
            </DialogTrigger>
          }
        />
        
        <ContestListCard title="Upcoming Contests" description="Contests scheduled for the future." contests={upcomingContests} isLoading={isLoading} error={error} />
        <ContestListCard title="Finished Contests" description="Past contests and their results." contests={finishedContests} isLoading={isLoading} error={error} />

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom Contest</DialogTitle>
            <DialogDescription>Add a new contest to the arena.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 py-2">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Contest Name</FormLabel> <FormControl><Input placeholder="e.g., My Awesome Contest" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Date & Time</FormLabel> <FormControl><Input type="datetime-local" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="link" render={({ field }) => ( <FormItem> <FormLabel>Contest Link</FormLabel> <FormControl><Input type="url" placeholder="https://example.com/contest" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="adminCode" render={({ field }) => ( <FormItem> <FormLabel>Admin Code</FormLabel> <FormControl><Input type="password" placeholder="Enter admin code" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Add Contest'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </div>
    </Dialog>
  );
}
