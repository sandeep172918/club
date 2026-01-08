
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ClubContest } from "@/types";
import { CalendarDays, ExternalLink } from "lucide-react";
import { format } from 'date-fns';
import Link from "next/link";

interface UpcomingContestsCardProps {
  contests: ClubContest[];
}

export default function UpcomingContestsCard({ contests }: UpcomingContestsCardProps) {

  if (!contests || contests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <CalendarDays className="mr-2 h-5 w-5" />
            Upcoming Club Contests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No upcoming club contests scheduled at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CalendarDays className="mr-2 h-5 w-5" />
          Upcoming Club Contests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {contests
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by original date
            .map((contest) => (
            <li 
              key={contest._id} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-card hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div className="flex-grow">
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{contest.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(contest.date), 'EEEE, MMM dd, yyyy')} - {contest.time}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3 sm:mt-0 flex-shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={contest.link} target="_blank" rel="noopener noreferrer" className="text-xs">
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
