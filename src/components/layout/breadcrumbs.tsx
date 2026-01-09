
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { mockTopics } from '@/lib/mock-data';

// Helper function to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topicId = searchParams?.get('topic');

  // Don't show breadcrumbs on the homepage or if pathname is null
  if (!pathname || pathname === '/') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  // Find topic name from mock data
  const topicName = topicId ? mockTopics.find(t => t.id === topicId)?.title : null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-sidebar-foreground/70">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {segments.map((segment, index) => {
          const path = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          
          let content = capitalize(segment.replace(/-/g, ' '));
          
          // If this is the last segment and a topic is specified, show the topic name
          if (isLast && topicName) {
            content = topicName;
          }

          return (
            <Fragment key={path}>
              <li>
                <div className="flex items-center">
                  <Link href={path + (topicId ? `?topic=${topicId}` : '')} className="hover:text-sidebar-foreground">
                    {content}
                  </Link>
                </div>
              </li>
              {!isLast && (
                <li>
                  <ChevronRight className="h-3 w-3" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
