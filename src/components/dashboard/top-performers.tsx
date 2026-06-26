"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import Link from "next/link";

interface Performer {
  rank: number;
  id: string;
  name: string;
  codeforcesHandle: string;
  rating: number;
  points: number;
  avatar: string;
}

interface TopPerformersProps {
  performers: Performer[];
}

export function TopPerformers({ performers = [] }: TopPerformersProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Top Performers</CardTitle>
            <CardDescription>Club leaders ranked by Codeforces rating and contribution points</CardDescription>
          </div>
          <Trophy className="h-4 w-4 text-[#7EE787]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] font-medium uppercase tracking-wider text-[#7A7A7A]">
                <th className="pb-3 pl-2 w-12 text-center">Rank</th>
                <th className="pb-3">Name</th>
                <th className="pb-3 hidden sm:table-cell">Handle</th>
                <th className="pb-3 text-right">Points</th>
                <th className="pb-3 pr-2 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {performers.map((student) => (
                <tr 
                  key={student.id} 
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="py-3.5 pl-2 text-center font-mono text-xs font-semibold text-[#7A7A7A]">
                    {student.rank === 1 ? (
                      <span className="text-[#7EE787]">01</span>
                    ) : (
                      `0${student.rank}`
                    )}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 border border-white/5">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-white/5 text-xs text-white">
                          {student.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Link 
                        href={`/profile?id=${student.id}`}
                        className="text-[13px] font-medium text-white hover:text-[#7EE787] transition-colors"
                      >
                        {student.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-3.5 hidden sm:table-cell">
                    <a 
                      href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[#B5B5B5] hover:text-white transition-colors"
                    >
                      {student.codeforcesHandle}
                    </a>
                  </td>
                  <td className="py-3.5 text-right font-mono text-[13px] font-medium text-[#B5B5B5]">
                    {student.points} pts
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="inline-block rounded-md bg-[#7EE787]/5 border border-[#7EE787]/15 px-2.5 py-0.5 font-mono text-[12px] font-semibold text-[#7EE787]">
                      {student.rating}
                    </span>
                  </td>
                </tr>
              ))}
              {performers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#7A7A7A]">
                    No top performers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
