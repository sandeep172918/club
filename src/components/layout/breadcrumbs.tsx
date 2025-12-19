
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface Topic {
  title: string;
  description: string;
}

// Helper function to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [topics, setTopics] = useState<Topic[]>([]);
  const topicTitleFromParam = searchParams.get('topic');


  useEffect(() => {
    async function fetchTopics() {
      // Only fetch if we are on a path that might need topics
      if (pathname.includes('/resources')) {
        try {
          const response = await fetch('/api/topics');
          if (response.ok) {
            const data = await response.json();
            setTopics(data);
          }
        } catch (error) {
          console.error("Failed to fetch topics for breadcrumbs:", error);
        }
      }
    }
    fetchTopics();
  }, [pathname]);

  // Don't show breadcrumbs on the homepage
  if (pathname === '/') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  
  // Find topic name from the fetched topics
  const topic = topicTitleFromParam ? topics.find(t => t.title.toLowerCase().replace(/\s/g, '-') === topicTitleFromParam) : null;
  const topicName = topic?.title;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-sidebar-foreground/70">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {segments.map((segment, index) => {
          const path = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          
          let content = capitalize(segment.replace(/-/g, ' '));
          
          if (isLast && topicName) {
            content = topicName;
          }

          return (
            <Fragment key={path}>
              <li>
                <div className="flex items-center">
                  <Link href={path + (topicTitleFromParam ? `?topic=${topicTitleFromParam}` : '')} className="hover:text-sidebar-foreground">
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
