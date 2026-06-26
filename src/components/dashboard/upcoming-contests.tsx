"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ExternalContest {
  id: string;
  name: string;
  platform: string;
  date: string;
}

interface ClubContest {
  id: string;
  name: string;
  link: string;
  date: string;
  time: string;
}

interface UpcomingContestsProps {
  externalContests: ExternalContest[];
  clubContests: ClubContest[];
}

export function UpcomingContests({ externalContests = [], clubContests = [] }: UpcomingContestsProps) {
  
  const formatDateString = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      // Check if valid date
      if (isNaN(d.getTime())) return dateStr;
      return format(d, "EEE, MMM dd, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Widget 1: Club Contests */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Club Contests</CardTitle>
              <CardDescription>Scheduled internal competitive programming events</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-[#7EE787]" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {clubContests.map((contest) => (
            <div 
              key={contest.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#111111]/40 hover:bg-[#111111] hover:border-white/10 transition-all duration-200"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[13px] font-semibold text-white truncate pr-2">
                  {contest.name}
                </span>
                <span className="text-[11px] font-mono text-[#7A7A7A]">
                  {formatDateString(contest.date)} @ {contest.time}
                </span>
              </div>
              <a 
                href={contest.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center rounded-full bg-white/5 border border-white/10 px-3 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white transition-all gap-1.5 flex-shrink-0"
              >
                Enter
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
          {clubContests.length === 0 && (
            <p className="text-center text-xs text-[#7A7A7A] py-6">
              No upcoming club contests scheduled
            </p>
          )}
        </CardContent>
      </Card>

      {/* Widget 2: External Contests (Codeforces / Codechef) */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Platform Contests</CardTitle>
              <CardDescription>Upcoming external Codeforces & CodeChef rounds</CardDescription>
            </div>
            <CheckCircle2 className="h-4 w-4 text-[#7EE787]" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {externalContests.map((contest) => (
            <div 
              key={contest.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#111111]/40 hover:bg-[#111111] hover:border-white/10 transition-all duration-200"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#7EE787] bg-[#7EE787]/5 border border-[#7EE787]/15 rounded-md px-1.5 py-0.5">
                    {contest.platform}
                  </span>
                  <span className="text-[13px] font-semibold text-white truncate pr-2">
                    {contest.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#7A7A7A] mt-0.5">
                  {formatDateString(contest.date)}
                </span>
              </div>
              <a 
                href={contest.platform === 'Codeforces' ? "https://codeforces.com/contests" : "https://www.codechef.com/contests"}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center rounded-full bg-white/5 border border-white/10 px-3 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white transition-all gap-1.5 flex-shrink-0"
              >
                Register
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          ))}
          {externalContests.length === 0 && (
            <p className="text-center text-xs text-[#7A7A7A] py-6">
              No platform contests available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
