
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { TopicCard } from '@/components/resources/topic-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Topic {
  title: string;
  description: string;
}

export default function ResourcesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch('/api/topics');
        if (!response.ok) {
          throw new Error('Failed to fetch topics.');
        }
        const data = await response.json();
        setTopics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTopics();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Resources"
        description="A curated list of topics to master for competitive programming."
      />
      
      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          topics.map((topic) => (
            <TopicCard 
              key={topic.title} 
              topic={topic}
            />
          ))
        )}
      </div>
    </div>
  );
}
