
'use client';

import { PageHeader } from '@/components/page-header';
import { UpcomingContestsCard } from '@/components/dashboard/upcoming-contests-card';

export default function UpcomingContestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Upcoming Contests"
        description="Stay informed about future coding competitions from various platforms."
      />
      <UpcomingContestsCard />
    </div>
  );
}
