
'use client';

import { Suspense } from 'react';
import { Breadcrumbs } from './breadcrumbs';
import { Skeleton } from '../ui/skeleton';

export function SuspendedBreadcrumbs() {
  return (
    <Suspense fallback={<Skeleton className="h-4 w-32" />}>
      <Breadcrumbs />
    </Suspense>
  );
}
