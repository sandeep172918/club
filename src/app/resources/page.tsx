
'use client';

import { PageHeader } from '@/components/page-header';
import { TopicCard } from '@/components/resources/topic-card';
import { mockTopics } from '@/lib/mock-data';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Resources"
        description="A curated list of topics to master for competitive programming."
      />
      
      <div className="space-y-4">
        {mockTopics.map((topic) => (
          <TopicCard 
            key={topic.id} 
            topic={topic}
          />
        ))}
      </div>
    </div>
  );
}
