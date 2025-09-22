
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockUpcomingContests } from "@/lib/mock-data";
import type { Contest } from "@/types";
import { CalendarDays, ExternalLink } from "lucide-react";
import { format } from 'date-fns';
import Link from "next/link";
import { useState, useEffect } from "react";

interface DisplayContest extends Contest {
  formattedDateString: string;
}

export function UpcomingContestsCard() {
  const [clientSideContests, setClientSideContests] = useState<DisplayContest[]>([]);
  const [isClientRendered, setIsClientRendered] = useState(false);

  useEffect(() => {
    // This block runs only on the client, after the component has mounted.
    // mockUpcomingContests will be evaluated using the client's `new Date()` context.
    const processedContests = mockUpcomingContests.map(contest => ({
      ...contest,
      // The new Date(contest.date) parses the ISO string.
      // The format call then uses client's locale/timezone settings for display.
      formattedDateString: format(new Date(contest.date), 'EEEE, MMM dd, yyyy - hh:mm a'),
    }));
    setClientSideContests(processedContests);
    setIsClientRendered(true);
  }, []); // Empty dependency array ensures this runs once on mount on the client.

  const getContestPlatformLink = (platform: 'Codeforces' | 'CodeChef') => {
    if (platform === 'Codeforces') {
      return `https://codeforces.com/contests`;
    }
    if (platform === 'CodeChef') {
      return `https://www.codechef.com/contests`;
    }
    return '#';
  };

  if (!isClientRendered) {
    // Render a placeholder during SSR and initial client render, before useEffect completes.
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <CalendarDays className="mr-2 h-5 w-5" />
            Upcoming Contests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading upcoming contests...</p>
        </CardContent>
      </Card>
    );
  }

  if (clientSideContests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <CalendarDays className="mr-2 h-5 w-5" />
            Upcoming Contests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No upcoming contests scheduled at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CalendarDays className="mr-2 h-5 w-5" />
          Upcoming Contests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {clientSideContests
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by original date
            .map((contest) => (
            <li 
              key={contest.id} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-card hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div className="flex-grow">
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{contest.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {contest.formattedDateString} {/* Use the client-side formatted date string */}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3 sm:mt-0 flex-shrink-0">
                <Badge variant={contest.platform === 'Codeforces' ? 'default' : 'secondary'} className="text-xs">
                  {contest.platform}
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link href={getContestPlatformLink(contest.platform)} target="_blank" rel="noopener noreferrer" className="text-xs">
                    View
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
