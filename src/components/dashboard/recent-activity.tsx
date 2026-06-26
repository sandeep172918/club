"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Award, Code, Zap, Calendar, ArrowUpRight } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  studentName: string;
  codeforcesHandle: string;
  title: string;
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  
  // Helper to resolve Lucide Icon based on activity details
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "contest":
        return <Award className="h-4 w-4 text-[#7EE787]" strokeWidth={1.5} />;
      case "potd":
        return <Zap className="h-4 w-4 text-[#E3B341]" strokeWidth={1.5} />;
      default:
        return <Code className="h-4 w-4 text-[#B5B5B5]" strokeWidth={1.5} />;
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Recent Club Activity</CardTitle>
        <CardDescription>Live updates of recent student accomplishments and solves</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <div className="relative border-l border-white/5 pl-4 ml-2 space-y-6">
          {activities.map((activity) => {
            let relativeTime = "";
            try {
              relativeTime = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
            } catch (e) {
              relativeTime = activity.timestamp;
            }

            return (
              <div key={activity.id} className="relative group">
                {/* Timeline Icon Node */}
                <div className="absolute -left-[25px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#161616] border border-white/10 ring-4 ring-[#161616] group-hover:border-white/20 transition-colors">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Activity Body */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[13px] font-semibold text-white group-hover:text-[#7EE787] transition-colors">
                      {activity.studentName}
                    </span>
                    <span className="text-[10px] font-mono text-[#7A7A7A] whitespace-nowrap">
                      {relativeTime}
                    </span>
                  </div>
                  
                  <p className="text-[12px] font-medium text-[#B5B5B5]">
                    {activity.title}
                  </p>
                  
                  {activity.description && (
                    <p className="text-[11px] font-mono text-[#7A7A7A] pt-0.5">
                      {activity.description}
                    </p>
                  )}
                  
                  {activity.codeforcesHandle && (
                    <div className="flex items-center gap-1 mt-1">
                      <a 
                        href={`https://codeforces.com/profile/${activity.codeforcesHandle}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-0.5 text-[10px] font-mono text-[#7A7A7A] hover:text-white transition-colors"
                      >
                        cf/{activity.codeforcesHandle}
                        <ArrowUpRight className="h-2 w-2" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {activities.length === 0 && (
            <div className="text-center text-xs text-[#7A7A7A] py-8">
              No recent activity recorded
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
