"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trophy, Medal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function POTDLeaderboardDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        fetchLeaderboard();
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/potd/leaderboard');
        const data = await res.json();
        if (data.success) {
            setLeaderboard(data.data);
        }
    } catch (error) {
        console.error("Failed to fetch leaderboard");
    } finally {
        setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
        case 0: return <Medal className="h-5 w-5 text-yellow-500" />;
        case 1: return <Medal className="h-5 w-5 text-gray-400" />;
        case 2: return <Medal className="h-5 w-5 text-amber-700" />;
        default: return <span className="font-mono text-muted-foreground w-5 text-center">{index + 1}</span>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
           <Trophy className="h-4 w-4 text-yellow-500" />
           POTD Leaderboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            POTD Champions
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
             <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
        ) : (
            <div className="overflow-y-auto flex-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.length > 0 ? (
                            leaderboard.map((entry, index) => (
                                <TableRow key={entry._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center justify-center">
                                            {getRankIcon(index)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://github.com/${entry.codeforcesHandle}.png`} />
                                                <AvatarFallback>{entry.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{entry.name}</span>
                                                <span className="text-xs text-muted-foreground">@{entry.codeforcesHandle || 'unknown'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-lg">
                                        {entry.points}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                    No points earned yet. Be the first!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
