
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Contest } from "@/types";
import { ExternalLink, Clock, CheckCircle } from "lucide-react";
import { format } from 'date-fns';
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface DisplayContest extends Contest {
  formattedDateString: string;
}

interface ContestListCardProps {
  title: string;
  description: string;
  contests: DisplayContest[];
  isLoading: boolean;
  error: string | null;
}

export function ContestListCard({ title, description, contests, isLoading, error }: ContestListCardProps) {

  const getContestPlatformLink = (contest: DisplayContest) => {
    if (contest.platform === 'Codeforces') {
      return `https://codeforces.com/contest/${contest.id}`; // assuming contest.id works for Codeforces
    } else if (contest.platform === 'Custom' && contest.link) {
        return contest.link;
    }
    return '#';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            {title === "Upcoming Contests" ? <Clock className="mr-2 h-5 w-5" /> : <CheckCircle className="mr-2 h-5 w-5" />}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            {title === "Upcoming Contests" ? <Clock className="mr-2 h-5 w-5" /> : <CheckCircle className="mr-2 h-5 w-5" />}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (contests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            {title === "Upcoming Contests" ? <Clock className="mr-2 h-5 w-5" /> : <CheckCircle className="mr-2 h-5 w-5" />}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No {title.toLowerCase()} scheduled at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          {title === "Upcoming Contests" ? <Clock className="mr-2 h-5 w-5" /> : <CheckCircle className="mr-2 h-5 w-5" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {contests
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((contest) => (
            <li 
              key={contest.id} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-card hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div className="flex-grow">
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{contest.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {contest.formattedDateString}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3 sm:mt-0 flex-shrink-0">
                <Badge variant={contest.platform === 'Codeforces' ? 'default' : 'secondary'} className="text-xs">
                  {contest.platform}
                </Badge>
                {contest.link && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={getContestPlatformLink(contest)} target="_blank" rel="noopener noreferrer" className="text-xs">
                      View
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
