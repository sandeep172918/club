
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
}

export default function LeaderboardTable({ leaderboard }: LeaderboardTableProps) {
  const [search, setSearch] = useState('');

  const getRatingChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getRatingChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="inline-block h-4 w-4" />;
    if (change < 0) return <ArrowDown className="inline-block h-4 w-4" />;
    return null;
  };

  const filteredLeaderboard = leaderboard
    .filter((entry) =>
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.codeforcesHandle.toLowerCase().includes(search.toLowerCase())
    );

  if (leaderboard.length === 0) {
    return <p>Leaderboard is empty.</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search for a student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeaderboard.map((entry, index) => (
            <TableRow key={entry.studentId}>
              <TableCell className="font-medium text-lg text-center">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://github.com/${entry.codeforcesHandle}.png`}
                      alt={entry.name}
                    />
                    <AvatarFallback>
                      {entry.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {entry.codeforcesHandle}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{entry.currentRating}</Badge>
              </TableCell>
              <TableCell
                className={`text-right font-semibold ${getRatingChangeColor(
                  entry.lastContestRatingChange
                )}`}
              >
                {getRatingChangeIcon(entry.lastContestRatingChange)}
                {Math.abs(entry.lastContestRatingChange)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
