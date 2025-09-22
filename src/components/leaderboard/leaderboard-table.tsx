'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { LeaderboardEntry } from '@/types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>CF Handle</TableHead>
          <TableHead>CC Handle</TableHead>
          <TableHead className="text-right">Rating</TableHead>
          <TableHead className="text-right w-[150px]">Rating Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry) => (
          <TableRow key={entry.studentId}>
            <TableCell className="font-medium">{entry.rank}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://placehold.co/40x40.png?text=${entry.name.charAt(0)}`} alt={entry.name} data-ai-hint="abstract pattern" />
                  <AvatarFallback>{entry.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{entry.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <a href={`https://codeforces.com/profile/${entry.codeforcesHandle}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {entry.codeforcesHandle}
              </a>
            </TableCell>
            <TableCell>
              <a href={`https://www.codechef.com/users/${entry.codechefHandle}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {entry.codechefHandle}
              </a>
            </TableCell>
            <TableCell className="text-right font-semibold">{entry.currentRating}</TableCell>
            <TableCell className="text-right">
              <Badge
                variant={entry.lastContestRatingChange > 0 ? 'default' : entry.lastContestRatingChange < 0 ? 'destructive' : 'secondary'}
                className="flex items-center justify-center gap-1 w-20"
              >
                {entry.lastContestRatingChange > 0 && <ArrowUpRight className="h-3 w-3" />}
                {entry.lastContestRatingChange < 0 && <ArrowDownRight className="h-3 w-3" />}
                {entry.lastContestRatingChange === 0 && <Minus className="h-3 w-3" />}
                {entry.lastContestRatingChange > 0 ? `+${entry.lastContestRatingChange}` : entry.lastContestRatingChange}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
